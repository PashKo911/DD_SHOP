import chalk from 'chalk'
import formatBytes from '../files/formatBytes.mjs'
import { performance } from 'perf_hooks'

export function attachHttpClientLogger(axiosInstance, { serviceName }) {
	axiosInstance.interceptors.request.use((config) => {
		config.metadata = {
			startTime: performance.now(),
		}

		const orderId = config.data?._meta?.orderId
		if (orderId) {
			console.info(chalk.magentaBright(`orderId=${orderId}`))
		}

		const method = chalk.cyan(config.method?.toUpperCase())
		const url = chalk.yellow(`${config.baseURL}${config.url}`)

		console.info(chalk.blue(`[HTTP → ${serviceName}]`), method, url)

		return config
	})

	axiosInstance.interceptors.response.use(
		(response) => {
			const { config, status, headers } = response
			const duration = Math.round(performance.now() - config.metadata.startTime)
			const length = headers['content-length']

			const statusColor =
				status >= 500 ? chalk.red : status >= 400 ? chalk.magenta : status >= 300 ? chalk.yellow : chalk.green

			console.info(
				chalk.blue(`[HTTP ← ${serviceName}]`),
				statusColor(status),
				chalk.gray(`${duration}ms`),
				length ? chalk.blue(formatBytes(length)) : ''
			)

			return response
		},
		(error) => {
			const { config, response } = error
			const duration = config?.metadata ? Math.round(performance.now() - config.metadata.startTime) : '—'

			console.error(
				chalk.red(`[HTTP ✖ ${serviceName}]`),
				config?.method?.toUpperCase(),
				`${config?.baseURL}${config?.url}`,
				response?.status || 'NO_RESPONSE',
				chalk.gray(`${duration}ms`)
			)

			return Promise.reject(error)
		}
	)
}
