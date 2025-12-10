import express from 'express'
import TypesController from '../controllers/types.mjs'

const router = express.Router()

router.get('/', TypesController.getTypes)

export default router
