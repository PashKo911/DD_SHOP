import './assets/styles/index.css'
// import './assets/styles/navEl.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './plugins/i18n'
import PrimeVue from 'primevue/config'
import StyleClass from 'primevue/styleclass'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

app.use(router)

app.use(i18n)

app.use(PrimeVue, {
	unstyled: true,
})
app.directive('styleclass', StyleClass)
app.use(ToastService)

app.mount('#app')
