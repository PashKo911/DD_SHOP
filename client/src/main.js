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

const app = createApp(App)
const head = createHead()

app.use(createPinia())

app.use(router)

app.use(i18n)

app.use(PrimeVue, {
	unstyled: true,
})

app.use(head)

app.use(ToastService)

app.directive('lockScroll', lockScroll)

app.mount('#app')
