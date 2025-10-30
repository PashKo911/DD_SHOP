import { validationResult } from 'express-validator'

import { deleteUploadedFiles, deleteEditedFiles } from '../../../utils/fileUtils.mjs'
import ColorsDBService from '../models/colors/ColorsDBService.mjs'
import DressStyleDBService from '../models/dressStyle/DressStyleDBService.mjs'
import SizeDBService from '../models/size/SizeDBService.mjs'
import CategoryDBService from '../models/category/CategoryDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'
import { getRate } from '../../../services/ratesCache.mjs'
import { appConstants } from '../../../constants/app.mjs'
import { resolveLocale } from '../../../utils/resolveLocale.mjs'

import FormatValidationErrors from '../../../validators/formatValidationErrors.mjs'

class ProductController {
	static async getAllProducts(req, res, next) {
		try {
			console.log('GET PRODUCTS CHECKING ++++++++++++++++++++++++++')
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
			const id = req.params.id

			const rate = await getRate(currency)

			const product = await ProductsDBService.getById(id, language, rate)
			res.status(200).json({ success: true, product })
		} catch (err) {
			next(err)
		}
	}
	//========================================================================================================================================================

	static async registerProduct(req, res, next) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const errors = FormatValidationErrors.formatExpressErrors(expressErrors)
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			return res.status(400).json({ errors })
		}
		try {
			await ProductsDBService.create(req.body)

			res.status(200).json({ message: 'Product registered successfully' })
		} catch (err) {
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			// const err = FormatValidationErrors.formatMongooseErrors(err.message, 'Product')
			next(err)
		}
	}

	static async updateProduct(req, res, next) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const errors = FormatValidationErrors.formatExpressErrors(expressErrors)
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			return res.status(400).json({ errors })
		}
		try {
			const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images]

			const productData = {
				...req.body,
				paths: [...images, ...req.body.paths],
			}

			if (req.params.id) {
				await ProductsDBService.update(req.params.id, productData)
				deleteEditedFiles(req.body.pathsToDelete, req.uploadFolderPath)
				res.status(200).json({ message: 'Product updated successfully' })
			}
		} catch (err) {
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			// const errors = FormatValidationErrors.formatMongooseUpdateErrors(err.message)
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
	//========================================================================================================================================================

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
			console.log('styles +++++++++++++')
			console.log(styles)
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
