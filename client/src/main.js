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

const app = createApp(App)
const head = createHead()

app.use(createPinia())

app.use(router)

await initI18n()

app.use(i18n)

app.use(PrimeVue, {
	unstyled: true,
})

app.use(head)

app.use(ToastService)

app.directive('lockScroll', lockScroll)
app.directive('styleclass', StyleClass)

app.mount('#app')
