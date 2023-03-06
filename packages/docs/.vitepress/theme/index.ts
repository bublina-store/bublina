import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Logo from './components/Logo.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(Logo)
    })
  }
}