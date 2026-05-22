import express from 'express'

import upload from '../../../middleware/UploadManager.mjs'
import ProductController from '../controllers/product.mjs'
import UserController from '../controllers/user.mjs'
import { userTypes } from '../../../constants/userTypes.mjs'
import { checkAuth, allowTypes } from '../../../middleware/auth.mjs'

const router = express.Router()

router.get('/users', checkAuth, allowTypes(userTypes.ADMIN, userTypes.MANAGER), UserController.usersList)
router.patch('/users/:id', checkAuth, allowTypes(userTypes.ADMIN), UserController.updateUser)
router.delete('/users/:id', checkAuth, allowTypes(userTypes.ADMIN), UserController.deleteUser)

router.get('/products/:id', ProductController.getProductForEdit)
router.get(
	'/products',
	checkAuth,
	allowTypes(userTypes.ADMIN, userTypes.MANAGER),
	ProductController.getAllProducts
)
router.post(
	'/products',
	checkAuth,
	allowTypes(userTypes.ADMIN, userTypes.MANAGER),
	upload.any(),
	ProductController.createProduct
)
router.put(
	'/products/:id',
	checkAuth,
	allowTypes(userTypes.ADMIN, userTypes.MANAGER),
	upload.any(),
	ProductController.updateProduct
)
router.delete(
	'/products/:id',
	checkAuth,
	allowTypes(userTypes.ADMIN, userTypes.MANAGER),
	ProductController.deleteProduct
)

export default router
