import express from 'express'
import { checkSchema } from 'express-validator'

import userSchema from '../../../validators/userSchema.mjs'
import AuthController from '../controllers/auth.mjs'

import { authMiddleware } from '../../../middleware/auth.mjs'

const router = express.Router()

router.post('/signup', checkSchema(userSchema), AuthController.signup)
router.post('/signin', checkSchema(userSchema), AuthController.signin)
router.post('/google', AuthController.authWithGoogle)

router.get('/profile', authMiddleware, AuthController.getProfile)

export default router
