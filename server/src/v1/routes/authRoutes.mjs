import express from 'express'
import { checkSchema } from 'express-validator'

import UserValidator from '../../../validators/userValidator.mjs'
import AuthController from '../controllers/authController.mjs'

const router = express.Router()

router.post('/sign-up', checkSchema(UserValidator.userSchema), AuthController.signup)
router.post('/sign-in', checkSchema(UserValidator.authSchema), AuthController.login)
// router.post('/set-guest', AuthController.setGuest)

// router.post('/logout', AuthController.logout)

export default router
