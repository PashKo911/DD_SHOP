import express from 'express'
import UserController from '../controllers/user.mjs'

const router = express.Router()

router.get('/users', UserController.usersList)
router.patch('/users/:id', UserController.updateUser)
router.delete('/users/:id', UserController.deleteUser)

export default router
