---
layout: docs
---

# Yet another state management library?

---

We love [Pinia](https://pinia.vuejs.org/), and this library is inspired by it.
With Vue 3 composition API, we moved from traditional Options API when it comes to components.
With stores, even when Pinia supports [setup functions](https://pinia.vuejs.org/core-concepts/#setup-stores), it has some shortcomings that we wanted to address:

## 1. It's hard to pass dependencies to the store.

There are times when your store manages a subset of the application state, and the subset depends on some outer factors e.g. the current route.
In this case, you can either pass the dependencies to the store, via mutating the state, or you can use actions to pass the dependencies to the store.
(Please note, that this is an oversimplified example, and there are other ways to solve this particular problem, but we wanted to show the problem in context of a store).

```ts
import { defineStore } from 'pinia'
import { getPost, putPost } from 'some-kind-of-api'

const usePostStore = defineStore('posts', () => {
  const postId = ref(0)
  const post = ref<Post>()
  const isLoaded = ref(false)
  
  return {
    post,
    isLoaded,
    load: async (id: string) => {
      isLoaded.value = false
      postId.value = id
      post.value = await getPost(id)
      isLoaded.value = true
    },
    save: async () => putPost(post.value),
    // ... a lot more functions
  }
})
```

To use such a store in a component, or a page, you need to always load the post according to your current needs - be it a route parameter or a component props.
What if those concerns starts to clash? What if you want to load the post in a different way, but you still want to use the same store?
This leads to another problem:

## 2. There is always just "one" store

If your requirements change, and you need to support editing multiple posts from previous example, you end up in a situation where you need to completely redesign the store.
The store is no longer a single entity, but a collection of entities, and every time you want to work with a particular post, you need to specify it.

```ts
import { defineStore } from 'pinia'
import { fetchPost } from 'some-kind-of-api'

const usePostStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  
  return {
    posts,
    load: async (id: string) => {
      posts.value = [...posts.value, await fetchPost(id)]
    },
    save: async (id: string) => {
      const post = posts.value.find(p => p.id === id)
      if (post) {
        await putPost(post)
      }
    },
    // ... a lot more functions
  }
})
```

To use this store effectively, you may think of creating a composable to remove all the repetitive use of identifiers, that can also be [injected](https://vuejs.org/guide/components/provide-inject.html#provide-inject) where needed.
```ts
const usePost = (id: string) => {
  const { 
    load, 
    save,
    // a lot more functions,
  } = usePostStore()
  
  return {
    post: computed(() => posts.value.find(p => p.id === id)),
    load: () => load(id),
    save: () => save(id),
    // a lot more functions
  }
}
```

While this is a valid solution, it's not very elegant, and when you need the same approach to a growing number of collections, it may become a burden.
We also skipped another big issue - what if you need to reuse the post in another store? Or what if you are doing some expensive computations, that you would rather to calculate just once?
This leads to our next problem.

## 3. There is not an easy way to share parts of the state between stores

As mentioned earlier, when you need to share an expensive computation, especially if it requires multiple stores an async requests, 
it is very hard to design a solution where all the subsequent parts are reusable in other stores and composables without any unnecessary computations or a lot of repetitions.
You may end up reaching for a solution for caching, or memoization, but it's not always the best solution.

## 4. Destructuring the store is not always possible

When you need to use only a part of the store, you can destructure it, and use only the parts you need. The problem lies in the way the store needs to be destructured.
With Pinia, you can call [storeToRefs](https://pinia.vuejs.org/api/modules/pinia.html#Functions-storeToRefs) but at the time of the writing, 
this will only include state and getters - to use actions, you still need to reference the store itself.

## Conclusion

We can't stress enough how awesome Pinia is, even with all of its shortcomings. It's a great library, it satisfied a lot of our needs, and we've build a lot of great software with it.
Unfortunately, we needed a more specialized solution, something that more closely represent our vision on what state management should be able to do, 
and we thought it may help others - or at least spark some discussions for the next big thing - that's why **Bublina** was created.
