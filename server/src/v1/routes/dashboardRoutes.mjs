import express from 'express'
import { checkSchema } from 'express-validator'

import ProductValidator from '../../../validators/productValidator.mjs'
import ProductController from '../controllers/productController.mjs'
import UserController from '../controllers/userController.mjs'
import RequestNormalizer from '../../../utils/RequestNormalizer.mjs'

import upload from '../../../middleware/UploadManager.mjs'

const router = express.Router()

router.get('/products', ProductController.getAllProducts)

router.get('/products/options', ProductController.getOptions)
router.get('/products/detail/:id', ProductController.getProduct)

router.post(
	'/products/add',
	upload.array('images', 4),
	RequestNormalizer.normalize,
	checkSchema(ProductValidator.productSchema),
	ProductController.registerProduct
)
router.put(
	'/products/edit/:id',
	upload.array('images', 4),
	RequestNormalizer.normalize,
	checkSchema(ProductValidator.productSchema),
	ProductController.updateProduct
)

router.delete('/products/delete', ProductController.deleteProduct)

router.get('/users', UserController.usersList)

router.put('/users/update/:id', UserController.updateUser)

router.delete('/users/delete', UserController.deleteUser)

export default router
