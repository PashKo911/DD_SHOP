import jwt from 'jsonwebtoken'
import config from '../config/default.mjs'

// Час дії токена
const expiresIn = config.expiredTime

// Секретний ключ для токена (повинен бути збережений у .env файлі)
const tokenKey = config.tokenKey

// Функція для парсингу Bearer токена та декодування користувача
export function parseBearer(bearer, headers) {
	let token
	// Перевіряємо, чи токен починається з 'Bearer '
	if (bearer.startsWith('Bearer ')) {
		token = bearer.slice(7) // Видаляємо 'Bearer ' з початку токена
	}
	try {
		// Декодуємо токен з використанням підготовленого секрету
		const decoded = jwt.verify(token, prepareSecret(headers))
		return decoded // Повертаємо декодовані дані
	} catch (err) {
		// Якщо токен невірний або закінчився його термін дії, буде згенеровано помилку
		throw new Error('Invalid token')
	}
}

// Функція для створення JWT токена
export function prepareToken(data, headers) {
	// Підписуємо дані токена з використанням підготовленого секрету
	const token = jwt.sign(data, prepareSecret(headers), {
		expiresIn, // Вказуємо час дії токена
	})
	const expireInMs = convertDuration(expiresIn)
	return {
		token,
		expireInMs,
	}
}

// Функція для підготовки секретного ключа з додаванням заголовків
function prepareSecret(headers) {
	// Секретний ключ токена об'єднується з user-agent та accept-language заголовками
	return tokenKey + headers['user-agent'] + headers['accept-language']
}

export function convertDuration(durationStr) {
	// Паттерн для перевірки всіх одиниць вимірювання
	const timePattern = /^(\d+)([mhdwMy])$/

	// Виконуємо регулярний вираз на рядку часу
	const match = durationStr.match(timePattern)

	if (!match) {
		throw new Error('Невірний формат часу')
	}

	const value = parseInt(match[1], 10)
	const unit = match[2]

	switch (unit) {
		case 'm': // хвилини
			return value * 60 * 1000
		case 'h': // години
			return value * 60 * 60 * 1000
		case 'd': // дні
			return value * 24 * 60 * 60 * 1000
		case 'w': // тижні
			return value * 7 * 24 * 60 * 60 * 1000
		case 'M': // місяці (приблизно 30.44 днів)
			return value * 30.44 * 24 * 60 * 60 * 1000
		case 'y': // роки (365.25 днів)
			return value * 365.25 * 24 * 60 * 60 * 1000
		default:
			throw new Error('Невірна одиниця вимірювання')
	}
}
