import express from 'express'
import { checkSchema } from 'express-validator'
import subscriberSchema from '../../../validators/subscriberSchema.mjs'
import SubscriberController from '../controllers/subscriber.mjs'

const router = express.Router()

router.post('/', checkSchema(subscriberSchema), SubscriberController.createSubscriber)

export default router
