---
layout: docs
---

# Multi-instance

---

When defining a sture using `createStore` you are not creating a single instance, 
but a definition that is used to construct instances every time you call the store composable.
Every instance is tied to the arguments that are passed to the function. 
Every time you call the store composable with different arguments, a new instance is created, 
while if you call it with the same arguments, you will get the same instance.

```ts
import { createStore } from '@bublina/store'

const useValue = createStore((name: string) => {
  return {
    count: ref(0),
  }
})

const first = useValue('first')   // first instance
const second = useValue('second') // second instance

const firstAgain = useValue('first') // first instance again
```


