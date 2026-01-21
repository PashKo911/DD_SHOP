import chalk from 'chalk'
import morgan from 'morgan'
import formatBytes from '../files/formatBytes.mjs'

const morganFormat = (tokens, req, res) => {
	const method = chalk.cyan(tokens.method(req, res))
	const url = chalk.yellow(tokens.url(req, res))
	const status = Number(tokens.status(req, res))
	const statusColor =
		status >= 500 ? chalk.red : status >= 400 ? chalk.magenta : status >= 300 ? chalk.yellow : chalk.green

	const statusText = statusColor(tokens.status(req, res))
	const rawLength = tokens.res(req, res, 'content-length')
	const contentLength = chalk.blue(formatBytes(rawLength))
	const time = chalk.gray(tokens['response-time'](req, res) + 'ms')

	return `${method} ${url} ${statusText} ${contentLength} ${time}`
}

const appLogger = morgan(morganFormat)

const origLog = console.log.bind(console)
const origWarn = console.warn.bind(console)
const origError = console.error.bind(console)
const origInfo = console.info.bind(console)
const origDebug = console.debug ? console.debug.bind(console) : origLog

console.log = (...args) => origLog(chalk.white.bgBlue.bold(' LOG '), ...args)
console.info = (...args) => origInfo(chalk.green('[INFO]'), ...args)
console.warn = (...args) => origWarn(chalk.yellow('[WARN]'), ...args)
console.error = (...args) => origError(chalk.red('[ERROR]'), ...args)
console.debug = (...args) => origDebug(chalk.blue('[DEBUG]'), ...args)

export const logInfo = (...args) => console.info(...args)
export const logWarn = (...args) => console.warn(...args)
export const logError = (...args) => console.error(...args)
export const logDebug = (...args) => console.debug(...args)

export default appLogger
