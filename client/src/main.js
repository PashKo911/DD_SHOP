import './assets/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import PrimeVue from 'primevue/config'
import StyleClass from 'primevue/styleclass'
import lockScroll from './directives/lockScroll'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

import { useCommonStore } from './stores/common'
import { initI18n } from './plugins/i18n'
import detectLocale from './utils/locale/detectLocale'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.use(router)

const locale = detectLocale(router.currentRoute.value)

const i18n = initI18n(locale)
const commonStore = useCommonStore()
commonStore.setLocale(locale)
app.use(i18n)

const head = createHead()
app.use(head)
app.use(PrimeVue, { unstyled: true })
app.use(ToastService)

app.directive('lockScroll', lockScroll)
app.directive('styleclass', StyleClass)

app.mount('#app')
