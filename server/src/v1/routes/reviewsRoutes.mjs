import express from 'express'
import ReviewsController from '../controllers/reviewsController.mjs'

const router = express.Router()

router.get('/', ReviewsController.getRandomReviews)

export default router
