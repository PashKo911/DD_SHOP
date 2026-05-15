import Subscriber from './Subscriber.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class SubscribersDBService extends MongooseCRUDManager {}

export default new SubscribersDBService(Subscriber)
