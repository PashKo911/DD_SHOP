import { HttpError } from '../../../errors/HttpError.mjs'
import mongoose from 'mongoose'

import ColorsDBService from '../models/colors/ColorsDBService.mjs'
import DressStyleDBService from '../models/dressStyle/DressStyleDBService.mjs'
import SizeDBService from '../models/size/SizeDBService.mjs'
import CategoryDBService from '../models/category/CategoryDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'

import ProductValidator from '../../../validators/productValidator.mjs'
import { getRate } from '../../../services/ratesCache.mjs'
import { appConstants } from '../../../constants/app.mjs'

import { resolveLocale } from '../../../utils/locale/resolveLocale.mjs'
import removeTempFiles from '../../../utils/files/removeTempFiles.mjs'
import groupUploadedFilesByVariant from '../../../utils/files/productImages/groupUploadedFilesByVariant.mjs'
import moveVariantImages from '../../../utils/files/productImages/moveVariantImages.mjs'
import removeProductImages from '../../../utils/files/productImages/removeProductImages.mjs'
import removeProductFolder from '../../../utils/files/productImages/removeProductFolder.mjs'
import buildComputedProductFields from '../../../utils/products/buildComputedProductFields.mjs'
import collectVariantImages from '../../../utils/products/collectVariantImages.mjs'
import ensureVariantImages from '../../../utils/products/ensureVariantImages.mjs'
import mergeVariantImages from '../../../utils/products/mergeVariantImages.mjs'

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
