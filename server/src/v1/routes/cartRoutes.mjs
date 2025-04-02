import express from 'express'
import CartController from '../controllers/cartController.mjs'

const router = express.Router()

router.get('/', CartController.getCartDetails)
router.post('/', CartController.addProduct)
router.put('/amount', CartController.updateProductAmount)
router.delete('/delete', CartController.deleteProduct)

export default router
