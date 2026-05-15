import express from 'express'
import ReviewsController from '../controllers/reviews.mjs'

const router = express.Router()

router.get('/', ReviewsController.getRandomReviews)

export default router
