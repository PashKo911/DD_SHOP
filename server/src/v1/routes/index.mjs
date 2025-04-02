import express from 'express'

import authRoutes from './authRoutes.mjs'
import userRoutes from './userRoutes.mjs'
import productRoutes from './productRoutes.mjs'
import dashboardRoutes from './dashboardRoutes.mjs'
import cartRoutes from './cartRoutes.mjs'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/users', userRoutes)

router.use('/products', productRoutes)

router.use('/dashboard', dashboardRoutes)

router.use('/cart', cartRoutes)

export default router
