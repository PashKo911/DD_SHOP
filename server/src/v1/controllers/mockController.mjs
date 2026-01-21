import axios from 'axios'
import crypto from 'crypto'

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const publicKeyBase64 = Buffer.from(publicKey).toString('base64')

class MockController {
	static async getInvoice(req, res, next) {
		try {
			const xToken = req.headers['x-token']
			const { invoiceId } = req.params

			// console.log(xToken, 'xToken')
			// console.log(invoiceId, 'invoiceId')

			const data = {
				invoiceId: 'p2_9ZgpZVsl3',
				status: null,
				failureReason: 'Неправильний CVV код',
				errCode: '59',
				amount: 4200,
				ccy: 980,
				finalAmount: 4200,
				createdDate: null,
				modifiedDate: null,
				reference: '84d0070ee4e44667b31371d8f8813947',
				destination: 'Покупка щастя',
				cancelList: [
					{
						status: null,
						amount: 4200,
						ccy: 980,
						createdDate: null,
						modifiedDate: null,
						approvalCode: '662476',
						rrn: '060189181768',
						extRef: '635ace02599849e981b2cd7a65f417fe',
					},
				],
				paymentInfo: {
					maskedPan: '444403******1902',
					approvalCode: '662476',
					rrn: '060189181768',
					tranId: '13194036',
					terminal: 'MI001088',
					bank: 'Універсал Банк',
					paymentSystem: 'visa',
					paymentMethod: null,
					fee: null,
					country: '804',
					agentFee: null,
				},
				walletData: {
					cardToken: '67XZtXdR4NpKU3',
					walletId: 'c1376a611e17b059aeaf96b73258da9c',
					status: null,
				},
				tipsInfo: {
					employeeId: null,
					amount: 4200,
				},
			}

			res.status(200).json({
				success: true,
				data,
			})
		} catch (error) {
			next(error)
		}
	}
	static async createInvoice(req, res, next) {
		try {
			const data = req.body

			console.log(req.body, 'req.body')

			const invoiceId = 'p2_9ZgpZVsl3'
			const pageUrl = 'https://www.example.com/payment'

			res.status(200).json({ success: true, data: { invoiceId, pageUrl } })

			setTimeout(async () => {
				const successPayMessage = {
					invoiceId,
					status: 'created',
					amount: data.amount,
					ccy: data.ccy,
					finalAmount: data.amount,
					createdDate: new Date().toISOString(),
					modifiedDate: new Date().toISOString(),
					reference: data.merchantPaymInfo.reference,
					approvalCode: '662476',
					rrn: '060189181768',
				}
				try {
					const payloadString = JSON.stringify(successPayMessage)

					const sign = crypto.createSign('SHA256')
					sign.write(payloadString)
					sign.end()

					const signature = sign.sign(privateKey, 'base64')

					await axios.post(data.webHookUrl, successPayMessage, {
						headers: {
							'X-Sign': signature,
							'Content-Type': 'application/json',
						},
					})

					console.log('[MOCK MONO] webhook sent')
				} catch (err) {
					console.error('[MOCK MONO] webhook failed', err.message)
				}
			}, 3000)
			setTimeout(async () => {
				const successPayMessage = {
					invoiceId,
					status: 'success',
					amount: data.amount,
					ccy: data.ccy,
					finalAmount: data.amount,
					createdDate: new Date().toISOString(),
					modifiedDate: new Date().toISOString(),
					reference: data.merchantPaymInfo.reference,
					approvalCode: '662476',
					rrn: '060189181768',
				}
				try {
					const payloadString = JSON.stringify(successPayMessage)

					const sign = crypto.createSign('SHA256')
					sign.write(payloadString)
					sign.end()

					const signature = sign.sign(privateKey, 'base64')

					await axios.post(data.webHookUrl, successPayMessage, {
						headers: {
							'X-Sign': signature,
							'Content-Type': 'application/json',
						},
					})

					console.log('[MOCK MONO] webhook sent')
				} catch (err) {
					console.error('[MOCK MONO] webhook failed', err.message)
				}
			}, 20000)
			// setTimeout(async () => {
			// 	const failurePayMessage = {
			// 		invoiceId,
			// 		status: 'failure',
			// 		failureReason: 'INSUFFICIENT_FUNDS',
			// 		errCode: 'BANK_DECLINE',
			// 		amount: data.amount,
			// 		ccy: data.ccy,
			// 		createdDate: new Date().toISOString(),
			// 		modifiedDate: new Date().toISOString(),
			// 		reference: data.merchantPaymInfo.reference,
			// 	}
			// 	try {
			// 		const payloadString = JSON.stringify(failurePayMessage)

			// 		const sign = crypto.createSign('SHA256')
			// 		sign.write(payloadString)
			// 		sign.end()

			// 		const signature = sign.sign(privateKey, 'base64')

			// 		await axios.post(data.webHookUrl, failurePayMessage, {
			// 			headers: {
			// 				'X-Sign': signature,
			// 				'Content-Type': 'application/json',
			// 			},
			// 		})

			// 		console.log('[MOCK MONO] webhook sent')
			// 	} catch (err) {
			// 		console.error('[MOCK MONO] webhook failed', err.message)
			// 	}
			// }, 9000)
		} catch (error) {
			next(error)
		}
	}
	static async getPubKey(req, res, next) {
		try {
			res.status(200).json({
				success: true,
				key: publicKeyBase64,
			})
		} catch (error) {
			next(error)
		}
	}
}

export default MockController
