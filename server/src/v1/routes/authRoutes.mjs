import express from 'express'
import { checkSchema } from 'express-validator'

import UserValidator from '../../../validators/userValidator.mjs'
import AuthController from '../controllers/authController.mjs'

import { authMiddleware } from '../../../middleware/auth.mjs'

const router = express.Router()

router.post('/signup', checkSchema(UserValidator.userSchema), AuthController.signup)
router.post('/signin', checkSchema(UserValidator.userSchema), AuthController.signin)
router.post('/google', AuthController.authWithGoogle)

router.get('/profile', authMiddleware, AuthController.getProfile)

export default router
