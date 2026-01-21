import express from 'express'

import authRoutes from './auth.mjs'
import subscriberRoutes from './subscriber.mjs'
import productRoutes from './product.mjs'
import reviewsRoutes from './reviews.mjs'
import adminRoutes from './admin.mjs'
import cartRoutes from './cart.mjs'
import typesRoutes from './types.mjs'
import mockRoutes from './mock.mjs'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/subscriber', subscriberRoutes)

router.use('/products', productRoutes)

router.use('/reviews', reviewsRoutes)

router.use('/admin', adminRoutes)

router.use('/cart', cartRoutes)

router.use('/types', typesRoutes)

router.use('/mock', mockRoutes)

export default router
