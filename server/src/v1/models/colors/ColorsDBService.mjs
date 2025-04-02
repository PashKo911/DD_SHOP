import Color from './Color.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class ColorsDBService extends MongooseCRUDManager {}

export default new ColorsDBService(Color)
