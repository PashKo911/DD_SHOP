import Size from './Size.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class SizeStyleDBService extends MongooseCRUDManager {}

export default new SizeStyleDBService(Size)
