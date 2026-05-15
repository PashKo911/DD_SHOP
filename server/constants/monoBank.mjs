import { config, IS_PRODUCTION } from '../config/default.mjs'

export const monoBankConstants = Object.freeze({
	activeStatuses: ['processing', 'created', 'hold'],
	redirectUrl: (id) => `${config.clientUrl}/profile?orderId=${id}&status=pending`,
	webHookUrl: `${config.apiPublicUrl}/mono`,
	baseUrl: IS_PRODUCTION ? 'https://api.monobank.ua/api/merchant' : 'http://localhost:3001/api/v1/mock',
})
