export const mapObjectValues = <TFrom, TTo>(obj: Record<string, TFrom>, fn: (value: TFrom, key: string) => TTo): Record<string, TTo> => {
  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([key, value]) => [key, fn(value, key)])
  )
}
