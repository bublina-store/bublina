# Bublina

Composition-first vue state management  

## Features

- Simple and easy to use
- Leveraging composition API
- Ability to have multiple instances of the same store
- Destructuring-capable
- Devtools support

## Usage

First, you need to define the store:

```ts
import { createStore } from '@bublina/store'

const useCounterStore = createStore('counter', (name: string) => {
  const counter = ref(0)
  
  return {
    name: computed(() => name),
    counter,
    increment: () => counter.value++,
    decrement: () => counter.value--
  }
})
```

And - that's it. The store is ready to be used. 
Supplying different arguments gives you different store instances with the same functionality, 
the same arguments gives you the same store instance. 
You may even use refs as arguments, which will automatically link on change.
```vue
<script setup>
const { counter: foo, increment, decrement } = useCounterStore('foo')
const { counter: bar } = useCounterStore('bar')
</script>

<template>
  <div>
    <span>Use dedicated actions to change foo: </span>
    <button @click="increment">+</button>
    <span>{{ foo }}</span>
    <button @click="decrement">-</button>
  </div>
  <div>
    <span>Or mutate it directly</span>
    <button @click="bar++">+</button>
    <span>{{ bar }}</span>
    <button @click="bar--">-</button>
  </div>
</template>
````

## Installation

  ```sh
  npm install @bublina/store
  ```

## Links
- [Docs](https://bublina-docs.vercel.app/)
- [Playground](https://stackblitz.com/github//bublina-store/bublina/tree/main/packages/playground)
