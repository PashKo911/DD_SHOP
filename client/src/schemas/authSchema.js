import { object, string } from 'yup'

const authSchema = object().shape({
	email: string()
		.trim()
		.required('errors.email.required')
		.email('errors.email.invalid'),
	password: string()
		.required('errors.password.required')
		.min(8, 'errors.password.length')
		.matches(/[a-z]/, 'errors.password.lowercase')
		.matches(/[A-Z]/, 'errors.password.uppercase')
		.matches(/[0-9]/, 'errors.password.numeric'),
})

export { authSchema }
