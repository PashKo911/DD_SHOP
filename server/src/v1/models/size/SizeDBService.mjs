import Size from './Size.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import config from '../../../../config/default.mjs'

class SizeStyleDBService extends MongooseCRUDManager {}

export default new SizeStyleDBService(Size)
