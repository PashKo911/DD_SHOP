import './assets/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import PrimeVue from 'primevue/config'
import StyleClass from 'primevue/styleclass'
import lockScroll from './directives/lockScroll'
import ToastService from 'primevue/toastservice'
import { initI18n, i18n } from './plugins/i18n'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(pinia)
app.use(router)

function bootstrapApp() {
	app.use(i18n)
	app.use(PrimeVue, { unstyled: true })
	app.use(head)
	app.use(ToastService)
	app.directive('lockScroll', lockScroll)
	app.directive('styleclass', StyleClass)
	app.mount('#app')
}

initI18n()
	.then(async () => {
		await useAuthStore().initialize()
		bootstrapApp()
	})
	.catch((err) => console.error('App init failed:', err))
