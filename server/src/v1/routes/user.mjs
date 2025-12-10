import express from 'express'
import UserController from '../controllers/user.mjs'
import userSchema from '../../../validators/userSchema.mjs'

import { checkSchema } from 'express-validator'

const router = express.Router()

router.get('/', UserController.usersList)

router.patch('/:id', UserController.updateUser)

router.delete('/:id', UserController.deleteUser)

export default router
