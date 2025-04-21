import VisaIcon from '@/components/icons/VisaIcon.vue'
import MasterCardIcon from '@/components/icons/MasterCardIcon.vue'
import PayPalIcon from '@/components/icons/PayPalIcon.vue'
import GooglePayIcon from '@/components/icons/GooglePayIcon.vue'

const paymentMethods = [
	{
		id: 'visa',
		icon: VisaIcon,
	},
	{
		id: 'mastercard',
		icon: MasterCardIcon,
	},
	{
		id: 'gPay',
		icon: GooglePayIcon,
	},
	{
		id: 'paypal',
		icon: PayPalIcon,
	},
]

export default paymentMethods
