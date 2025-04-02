import { parseBearer } from '../utils/jwtHelpers.mjs'
import checkUserPermissions from '../utils/checkUserPermissions.mjs'

// Функція для налаштування аутентифікації та авторизації
const auth = (app) => {
	// Middleware для налаштування заголовків CORS
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		)
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
		next() // Передача обробки наступному middleware
	})

	// Middleware для перевірки аутентифікації та авторизації
	app.use(async (req, res, next) => {
		// Закриті шляхи
		// const closedPaths = ['/dashboard']
		// const guestId = req.headers['x-guest-id']

		// let user
		// if (guestId) {
		// 	req.user = {}
		// 	req.user.id = guestId
		// }

		if (req.headers.authorization) {
			// Парсинг токена та додавання користувача до запиту
			req.user = parseBearer(req.headers.authorization, req.headers)
		}

		// if (closedPaths.some((path) => req.path.includes(path))) {
		// 	try {
		// 		const hasAccess = await checkUserPermissions(user.id, req.path)
		// 		if (!hasAccess) {
		// 			return res.status(403).json({ result: 'Forbidden' })
		// 		}
		// 	} catch (err) {
		// 		return res.status(401).json({ result: 'Access Denied' })
		// 	}
		// }

		next() // Передача обробки наступному middleware
	})
}

// Експорт функції auth як модуля за замовчуванням
export default auth
