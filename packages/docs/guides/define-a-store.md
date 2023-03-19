---
layout: docs
---

# Define a store

---

To define a store, you need to use the `createStore` function. 
It accepts a function that returns an object with the store's state and actions.
This function may accept arguments, that can be used to initialize the store.

The `createStore` function returns a new function that can be used to create instances of the store.
We call this function a store composable.

It is safe to deconstruct the store composable, and use only the parts you need.

```ts
import { createStore } from '@bublina/store'

const useCounter = createStore((name: string) => {
  const count = ref(0)
  
  return {
    count,
    increment: () => { count.value++ },
    decrement: () => { count.value-- },
  }
})

const { count, increment, decrement } = useCounter('foo')
```



