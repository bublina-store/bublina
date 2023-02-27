import { createRouter, createWebHistory } from 'vue-router'
import Bublina from '@bublina/store'
import App from './app.vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import routes from '~pages'

import '@unocss/reset/tailwind.css'
// import './styles/main.css'
import 'uno.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(Bublina)
app.use(router)

app.mount('#app')
