import express from 'express'
import MockController from '../controllers/mockController.mjs'

const router = express.Router()

router.post('/invoice/create', MockController.createInvoice)
router.get('/invoice/status/:invoiceId', MockController.getInvoice)
router.get('/pubkey', MockController.getPubKey)
export default router
