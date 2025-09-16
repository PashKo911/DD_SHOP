import express from 'express'
import UserController from '../controllers/user.mjs'
import userSchema from '../../../validators/userSchema.mjs'

import { checkSchema } from 'express-validator'

const router = express.Router()

router.get('/edit/:id', UserController.getUser)

router.post('/add/:id?', checkSchema(userSchema), UserController.registerUser)

export default router
