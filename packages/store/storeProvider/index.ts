export const createStoreProvider = () => {
  return {
  }
}

export type StoreProvider = ReturnType<typeof createStoreProvider>

// enumerate stores by id
// - include name
// - enumerate instances
//   - include id
//   - include key
