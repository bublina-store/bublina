---
layout: docs
---

::: warning  
Although the library is already used in several enterprise-grade solutions, it's still the subject of active development, and **the API may change even between minor versions**.
:::

# Get Started

---

This library is still in early development, so expect breaking changes.  
To install the latest version, add the package using your favorite package manager:

::: code-group
```sh [pnpm]
pnpm add @bublina/store
```

```sh [yarn]
yarn add @bublina/store
```

```sh [npm]
npm install @bublina/store
```
:::

To use the library, you need to install the Vue 3 plugin:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import Bublina from '@bublina/store' // [!code ++]

const app = createApp(App)

app.use(Bublina) // [!code ++]

app.mount('#app')
```