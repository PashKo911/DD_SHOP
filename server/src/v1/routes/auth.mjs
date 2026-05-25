import express from 'express'
import { checkSchema } from 'express-validator'

import userSchema from '../../../validators/userSchema.mjs'
import AuthController from '../controllers/auth.mjs'

import { checkAuth } from '../../../middleware/auth.mjs'
import { authRateLimiter } from '../../../services/rateLimit.mjs'

const router = express.Router()

router.post('/signup', authRateLimiter, checkSchema(userSchema), AuthController.signup)
router.post('/signin', authRateLimiter, checkSchema(userSchema), AuthController.signin)
router.post('/google', authRateLimiter, AuthController.authWithGoogle)
router.post('/refresh', authRateLimiter, AuthController.refresh)
router.post('/logout', AuthController.logout)

router.get('/profile', checkAuth, AuthController.getProfile)

export default router
