import express from 'express'

import ProductController from '../controllers/productController.mjs'

const router = express.Router()

router.get('/', ProductController.getAllProducts)

router.get('/suggestions', ProductController.getSuggestions)

router.get('/options', ProductController.getOptions)
router.get('/styles', ProductController.getStyles)
router.get('/detail/:id', ProductController.getProduct)

export default router
