import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class DressStyleDBService extends MongooseCRUDManager {}

export default new DressStyleDBService(DressStyle)
