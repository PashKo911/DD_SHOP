import { validationResult } from 'express-validator'

import { deleteUploadedFiles, deleteEditedFiles } from '../../../utils/fileUtils.mjs'
import ColorsDBService from '../models/colors/ColorsDBService.mjs'
import DressStyleDBService from '../models/dressStyle/DressStyleDBService.mjs'
import SizeDBService from '../models/size/SizeDBService.mjs'
import GenderDBService from '../models/gender/GenderDBService.mjs'
import ProductsDBService from '../models/product/ProductsDBService.mjs'

import FormatValidationErrors from '../../../validators/formatValidationErrors.mjs'

class ProductController {
	static async getAllProducts(req, res) {
		try {
			const filters = {}

			for (const key in req.query) {
				if (req.query[key]) filters[key] = req.query[key]
			}
			const productsList = await ProductsDBService.getList(filters)
			res.status(200).json({
				products: productsList,
			})
		} catch (error) {
			res.status(500).json({ error: 'Error fetching products' })
		}
	}

	static async getProduct(req, res) {
		try {
			const id = req.params.id

			const product = await ProductsDBService.getById(id)
			res.status(200).json(product)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Error fetching products' })
		}
	}

	static async registerProduct(req, res) {
		const expressErrors = validationResult(req)

		if (!expressErrors.isEmpty()) {
			const errors = FormatValidationErrors.formatExpressErrors(expressErrors)
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			return res.status(400).json({ errors })
		}
		try {
			await ProductsDBService.create(req.body)

			res.status(200).json({ message: 'Product registered successfully' })
		} catch (error) {
			console.error(error)
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			const errors = FormatValidationErrors.formatMongooseErrors(error.message, 'Product')
			res.status(400).json({ errors })
		}
	}

	static async updateProduct(req, res) {
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
				res.status(200).json({ message: 'Product registered successfully' })
			}
		} catch (error) {
			deleteUploadedFiles(req.files, req.uploadFolderPath)
			const errors = FormatValidationErrors.formatMongooseUpdateErrors(error.message)
			res.status(400).json({ errors })
		}
	}

	static async deleteProduct(req, res) {
		try {
			await ProductsDBService.deleteById(req.body.id)
			res.status(200).json({ message: 'Product deleted' })
		} catch (error) {
			res.status(500).json({ error: 'Error deleting product' })
		}
	}

	static async getOptions(req, res) {
		try {
			const colors = await ColorsDBService.getList({})
			const sizes = await SizeDBService.getList({})
			const styles = await DressStyleDBService.getList({})
			const genders = await GenderDBService.getList({})

			const priceRange = await ProductsDBService.getPriceRange()

			res.status(200).json({
				genders,
				styles,
				colors,
				sizes,
				priceRange,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server error' })
		}
	}
}

export default ProductController
