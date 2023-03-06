import fs from 'fs'

export const mapObjectValues = <T, U>(obj: Record<string, T>, fn: (value: T, key: string) => U): Record<string, U> => {
  if (!obj) {
    return undefined
  }

  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([key, value]) => [key, fn(value, key)])
  )
}

export const readJson = async <T = unknown>(path: string): Promise<T> => {
  const blob = await fs.promises.readFile(path)

  return JSON.parse(blob.toString()) as T
}

export const writeJson = async <T>(path: string, obj: T): Promise<void> => {
  await fs.promises.writeFile(path, JSON.stringify(obj, null, 2))
}

export type PackageJson = {
  version?: string,
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>
}
