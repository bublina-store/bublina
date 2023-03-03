import { Ref } from 'vue'

export type Fn<TArgs extends readonly unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => TReturn

export type StoreName = string
export type Store = Ref<unknown> | Record<string, Ref<unknown> | Fn>
