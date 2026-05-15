<template>
	<Button
		type="button"
		severity="secondary"
		fluid
		:contrast="isContrast"
		size="large"
		:label="t('buttons.googleButton')"
		@click="onSignInWithGoogle"
	>
		<template #icon>
			<google-icon class="relative shrink-0" />
		</template>
	</Button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useScriptTag } from '@vueuse/core'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import routeNames from '@/router/routeNames'

import apiConfig from '@/config/api'

import Button from '@/components/ui/buttons/Button.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'

const props = defineProps({
	isContrast: {
		type: Boolean,
		default: true,
	},
})
const { t } = useI18n()

const router = useRouter()

const { initCart } = useCartStore()

const authStore = useAuthStore()
const { signinWithGoogle } = authStore

let googleClient

const successCallback = () => {
	router.push({ name: routeNames.HOME })
}

const initGoogleClient = () => {
	googleClient = window.google.accounts.oauth2.initCodeClient({
		client_id: apiConfig.googleClientId,
		scope: 'openid profile email',
		ux_mode: 'popup',
		callback: (googleAuthCode) =>
			signinWithGoogle(googleAuthCode, { successCallback }),
	})
}

useScriptTag('https://accounts.google.com/gsi/client', initGoogleClient, {
	attrs: { async: true },
})
//========================================================================================================================================================

const onSignInWithGoogle = () => {
	googleClient.requestCode()
}
</script>
