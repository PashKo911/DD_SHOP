import express from 'express'

import authRoutes from './auth.mjs'
import subscriberRoutes from './subscriber.mjs'
import userRoutes from './user.mjs'
import productRoutes from './product.mjs'
import reviewsRoutes from './reviews.mjs'
import dashboardRoutes from './dashboard.mjs'
import cartRoutes from './cart.mjs'
import typesRoutes from './types.mjs'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/subscriber', subscriberRoutes)

router.use('/users', userRoutes)

router.use('/products', productRoutes)

router.use('/reviews', reviewsRoutes)

router.use('/dashboard', dashboardRoutes)

router.use('/cart', cartRoutes)

router.use('/types', typesRoutes)

export default router
