import './assets/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import i18n from './plugins/i18n'
import PrimeVue from 'primevue/config'
import lockScroll from './directives/lockScroll'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import setInitialLocale from './utils/localeHelpers/setInitialLocale'

const app = createApp(App)
const head = createHead()

app.use(createPinia())

app.use(router)

app.use(i18n)

setInitialLocale(i18n, router)

app.use(PrimeVue, {
	unstyled: true,
})

app.use(head)

app.use(ToastService)

app.directive('lockScroll', lockScroll)

app.mount('#app')
