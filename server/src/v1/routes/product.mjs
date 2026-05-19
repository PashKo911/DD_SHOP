import express from 'express'

import ProductController from '../controllers/product.mjs'
import upload from '../../../middleware/UploadManager.mjs'

const router = express.Router()

router.get('/', ProductController.getAllProducts)
router.get('/suggestions', ProductController.getSuggestions)
router.get('/options', ProductController.getOptions)
router.get('/styles', ProductController.getStyles)
router.get('/detail/:id', ProductController.getProduct)
router.get('/:id', ProductController.getProductForEdit)

router.post('/', upload.any(), ProductController.createProduct)
router.put('/:id', upload.any(), ProductController.updateProduct)

export default router
