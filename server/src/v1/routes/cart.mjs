import express from 'express'
import CartController from '../controllers/cart.mjs'
import { checkAuth, attachUserFromBarrier } from '../../../middleware/auth.mjs'
import { checkSchema } from 'express-validator'
import cartProductSchema from '../../../validators/cartProductSchema.mjs'

const router = express.Router()

router.post('/populate', attachUserFromBarrier, CartController.populateCart)
router.post('/init', checkAuth, CartController.initCart)
router.post('/add', checkAuth, checkSchema(cartProductSchema), CartController.addProduct)
router.put('/update', checkAuth, checkSchema(cartProductSchema), CartController.updateProductQuantity)
router.delete('/delete', checkAuth, CartController.deleteProduct)

export default router
