import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { HttpError } from '../../../errors/HttpError.mjs'
import mongoose from 'mongoose'
import { errorCodes } from '../../../constants/errorCodes.mjs'
import ColorsDBService from '../models/colors/ColorsDBService.mjs'
import DressStyleDBService from '../models/dressStyle/DressStyleDBService.mjs'
import SizeDBService from '../models/size/SizeDBService.mjs'
import CategoryDBService from '../models/category/CategoryDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'
import ProductValidator from '../../../validators/productValidator.mjs'
import { getRate } from '../../../services/ratesCache.mjs'
import { appConstants } from '../../../constants/app.mjs'
import { resolveLocale } from '../../../utils/resolveLocale.mjs'

const groupUploadedFilesByVariant = (files = []) => {
	return files.reduce((acc, file) => {
		const match = file.fieldname.match(/^variantImages-(\d+)$/)

		if (!match) {
			return acc
		}

		const variantIndex = Number(match[1])

		if (!Array.isArray(acc[variantIndex])) {
			acc[variantIndex] = []
		}

		acc[variantIndex].push(file)

		return acc
	}, {})
}

const moveVariantImages = ({ filesByVariant, categoryKey, productId }) => {
	const productFolder = path.join(process.cwd(), 'public/uploads/products', categoryKey, productId)

	fs.mkdirSync(productFolder, {
		recursive: true,
	})

	return Object.entries(filesByVariant).reduce((acc, [variantIndex, files]) => {
		acc[variantIndex] = files.map((file) => {
			const extension = path.extname(file.originalname) || '.webp'
			const filename = `image-${uuidv4()}${extension}`
			const finalPath = path.join(productFolder, filename)
			fs.renameSync(file.path, finalPath)
			return `/uploads/products/${categoryKey}/${productId}/${filename}`
		})

		return acc
	}, {})
}

const removeTempFiles = (files = []) => {
	files.forEach((file) => {
		if (!file?.path) {
			return
		}

		if (fs.existsSync(file.path)) {
			fs.unlinkSync(file.path)
		}
	})
}

const mergeVariantImages = (variants, uploadedImagesMap) => {
	return variants.map((variant, index) => {
		const keptImages = Array.isArray(variant.images) ? variant.images : []

		const uploadedImages = uploadedImagesMap[index] || []

		return {
			...variant,
			images: [...keptImages, ...uploadedImages],
		}
	})
}

const collectVariantImages = (variants = []) =>
	variants.flatMap((variant) => (Array.isArray(variant.images) ? variant.images : []))

const buildComputedProductFields = (variants, categoryKey) => {
	const prices = variants.map((variant) => Number(variant.price))
	const ratings = variants
		.map((variant) => Number(variant.rating))
		.filter((rating) => Number.isFinite(rating))

	const cheapestVariant = variants.reduce((best, current) =>
		Number(current.price) < Number(best.price) ? current : best
	)

	return {
		categoryKey,

		minPrice: Math.min(...prices),

		maxPrice: Math.max(...prices),

		maxRating: ratings.length ? Math.max(...ratings) : 0,

		defaultVariant: cheapestVariant._id,
	}
}

const ensureVariantImages = (variants = []) => {
	const invalidVariantIndex = variants.findIndex(
		(variant) => !Array.isArray(variant.images) || variant.images.length === 0
	)

	if (invalidVariantIndex !== -1) {
		createValidationError([
			{
				field: `variants.${invalidVariantIndex}.images`,
				validationCode: 'required',
			},
		])
	}
}

const removeProductImages = (imagePaths = []) => {
	imagePaths.forEach((imagePath) => {
		try {
			if (!imagePath || typeof imagePath !== 'string') {
				return
			}

			const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

			const absolutePath = path.join(process.cwd(), 'public', normalizedPath)

			if (!fs.existsSync(absolutePath)) {
				console.warn(`File not found: ${absolutePath}`)

				return
			}

			fs.unlinkSync(absolutePath)
		} catch (err) {
			console.warn(`Failed to remove image: ${imagePath}`, err)
		}
	})
}

const removeProductFolder = ({ categoryKey, productId }) => {
	try {
		const productFolderPath = path.join(process.cwd(), 'public/uploads/products', categoryKey, productId)

		if (!fs.existsSync(productFolderPath)) {
			console.warn(`Product folder not found: ${productFolderPath}`)

			return
		}

		fs.rmSync(productFolderPath, {
			recursive: true,
			force: true,
		})
	} catch (err) {
		console.warn(`Failed to remove product folder: ${productId}`, err)
	}
}

class ProductController {
	static async getAllProducts(req, res, next) {
		try {
			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency

			const rate = await getRate(currency)
			const data = await ProductsDBService.getList(req.query, language, currency, rate)

			res.status(200).json({
				success: true,
				data,
			})
		} catch (err) {
			next(err)
		}
	}

	static async getSuggestions(req, res, next) {
		try {
			const lang = resolveLocale(req)
			const data = await ProductsDBService.getSuggestions(req.query, lang)

			res.status(200).json({
				success: true,
				data,
			})
		} catch (err) {
			next(err)
		}
	}

	static async getProduct(req, res, next) {
		try {
			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency
			const rate = await getRate(currency)
			const product = await ProductsDBService.getById(req.params.id, language, rate)

			res.status(200).json({ success: true, product })
		} catch (err) {
			next(err)
		}
	}

	static async getProductForEdit(req, res, next) {
		try {
			const product = await ProductsDBService.getAdminById(req.params.id)
			res.status(200).json({ success: true, product })
		} catch (err) {
			next(err)
		}
	}

	static async createProduct(req, res, next) {
		try {
			const payload = ProductValidator.validatePayload(req.body)
			const category = await CategoryDBService.getById(payload.category)

			if (!category) {
				throw new HttpError(400, 'Invalid category')
			}

			const filesByVariant = groupUploadedFilesByVariant(req.files)
			const tempProductId = new mongoose.Types.ObjectId()

			const uploadedImagesMap = moveVariantImages({
				filesByVariant,
				categoryKey: category.label.en,
				productId: tempProductId.toString(),
			})

			payload.variants = mergeVariantImages(payload.variants, uploadedImagesMap)

			ensureVariantImages(payload.variants)

			const computedFields = buildComputedProductFields(payload.variants, category.key)
			const product = await ProductsDBService.createProduct({
				...payload,
				...computedFields,
				_id: tempProductId,
			})

			res.status(201).json({
				success: true,
				message: 'Product created successfully',
				product,
			})
		} catch (err) {
			removeTempFiles(req.files)

			next(err)
		}
	}

	static async updateProduct(req, res, next) {
		try {
			const existingProduct = await ProductsDBService.getAdminById(req.params.id)

			if (!existingProduct) {
				throw new HttpError(404, 'Product not found')
			}

			const payload = ProductValidator.validatePayload(req.body)
			const category = await CategoryDBService.getById(payload.category)

			if (!category) {
				throw new HttpError(400, 'Invalid category')
			}

			const existingImages = collectVariantImages(existingProduct?.variants)
			const filesByVariant = groupUploadedFilesByVariant(req.files)

			const uploadedImagesMap = moveVariantImages({
				filesByVariant,
				categoryKey: category.label.en,
				productId: existingProduct._id.toString(),
			})

			payload.variants = mergeVariantImages(payload.variants, uploadedImagesMap)

			ensureVariantImages(payload.variants)

			const computedFields = buildComputedProductFields(payload.variants, category.key)
			const nextImages = collectVariantImages(payload.variants)
			const removedImages = existingImages.filter((imagePath) => !nextImages.includes(imagePath))

			const updatedProduct = await ProductsDBService.updateProduct(req.params.id, {
				...payload,
				...computedFields,
			})

			removeProductImages(removedImages)

			res.status(200).json({
				success: true,
				message: 'Product updated successfully',
				product: updatedProduct,
			})
		} catch (err) {
			removeTempFiles(req.files)

			next(err)
		}
	}

	static async deleteProduct(req, res, next) {
		try {
			const product = await ProductsDBService.getAdminById(req.params.id)

			if (!product) {
				throw new HttpError(404, 'Product not found')
			}

			removeProductFolder({
				categoryKey: product.categoryKey,
				productId: product._id.toString(),
			})

			await ProductsDBService.deleteById(req.params.id)

			res.status(200).json({
				success: true,
				message: 'Product deleted',
			})
		} catch (err) {
			next(err)
		}
	}

	static async getOptions(req, res, next) {
		try {
			const language = resolveLocale(req)
			const currency = req.headers.currency || appConstants.defaultCurrency
			const rate = await getRate(currency)

			const colors = await ColorsDBService.getList(language)
			const sizes = await SizeDBService.getList()
			const styles = await DressStyleDBService.getList(language)
			const categories = await CategoryDBService.getList({})
			const price = await ProductsDBService.getPriceRange(rate)

			res.status(200).json({
				success: true,
				categories,
				styles,
				colors,
				sizes,
				price,
			})
		} catch (err) {
			next(err)
		}
	}

	static async getStyles(req, res, next) {
		try {
			const language = resolveLocale(req)
			const styles = await DressStyleDBService.getList(language)

			res.status(200).json({
				success: true,
				styles,
			})
		} catch (err) {
			next(err)
		}
	}
}

export default ProductController
