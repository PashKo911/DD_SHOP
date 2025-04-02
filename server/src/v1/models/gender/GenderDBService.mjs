import Gender from './Gender.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class GenderDBService extends MongooseCRUDManager {}

export default new GenderDBService(Gender)
