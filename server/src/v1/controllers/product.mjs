import { deleteUploadedFiles, deleteEditedFiles } from '../../../utils/fileUtils.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'
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

const groupUploadedFilesByVariant = (files = [], categoryKey) => {
	return files.reduce((acc, file) => {
		const match = file.fieldname.match(/^variantImages-(\d+)$/)
		if (!match) return acc

		const variantIndex = Number(match[1])
		const relativePath = `/uploads/products/${categoryKey}/${file.filename}`

		if (!Array.isArray(acc[variantIndex])) {
			acc[variantIndex] = []
		}

		acc[variantIndex].push(relativePath)
		return acc
	}, {})
}

const mergeVariantImages = (variants, uploadedFilesMap) => {
	return variants.map((variant, index) => ({
		...variant,
		images: [...variant.images, ...(uploadedFilesMap[index] || [])],
	}))
}

const ensureVariantImages = (variants = []) => {
	const invalidVariantIndex = variants.findIndex(
		(variant) => !Array.isArray(variant.images) || variant.images.length === 0,
	)

	if (invalidVariantIndex !== -1) {
		throw new HttpError(400, 'Incorrect product data', {
			code: errorCodes.VALIDATION_ERROR,
			details: [
				{
					field: `variants.${invalidVariantIndex}.images`,
					validationCode: 'required',
				},
			],
			expose: true,
		})
	}
}

const collectVariantImages = (variants = []) =>
	variants.flatMap((variant) => (Array.isArray(variant.images) ? variant.images : []))

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
			const uploadedFilesMap = groupUploadedFilesByVariant(req.files, payload.categoryKey)

			payload.variants = mergeVariantImages(payload.variants, uploadedFilesMap)
			ensureVariantImages(payload.variants)
			const product = await ProductsDBService.createProduct(payload)

			res.status(201).json({
				success: true,
				message: 'Product created successfully',
				product,
			})
		} catch (err) {
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			next(err)
		}
	}

	static async updateProduct(req, res, next) {
		try {
			const existingProduct = await ProductsDBService.getAdminById(req.params.id)
			const payload = ProductValidator.validatePayload(req.body)
			const uploadedFilesMap = groupUploadedFilesByVariant(req.files, payload.categoryKey)

			payload.variants = mergeVariantImages(payload.variants, uploadedFilesMap)
			ensureVariantImages(payload.variants)

			const updatedProduct = await ProductsDBService.updateProduct(req.params.id, payload)
			const existingImages = collectVariantImages(existingProduct?.variants)
			const nextImages = collectVariantImages(payload.variants)
			const removedImages = existingImages.filter((imagePath) => !nextImages.includes(imagePath))

			deleteEditedFiles(removedImages)

			res.status(200).json({
				success: true,
				message: 'Product updated successfully',
				product: updatedProduct,
			})
		} catch (err) {
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			next(err)
		}
	}

	static async deleteProduct(req, res, next) {
		try {
			await ProductsDBService.deleteById(req.body.id)
			res.status(200).json({ message: 'Product deleted' })
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
			const categories = (await CategoryDBService.getList({})).map((category) => ({
				...category,
				label: category.label?.[language] || category.key,
			}))
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
