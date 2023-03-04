import { createEvent } from '../utilities/createEvent'

export const createDependencyTracker = <T>(defaultDependency: T) => {
  const dependencies = new Map<T, T[]>()
  const dependants = new Map<T, T[]>()

  const dependenciesChanged = createEvent()
  const emptyDependants = createEvent<T>()

  let currentDependency = defaultDependency

  const removeDependency = (from: T, to: T) => {
    const dependenciesFrom = dependencies.get(from)
    const dependantsTo = dependants.get(to)

    const oldDependencyIndex = dependenciesFrom?.findIndex(d => d === to)
    const oldDependantIndex = dependantsTo?.findIndex(d => d === from)

    dependenciesFrom?.splice(oldDependencyIndex as number, 1)
    dependantsTo?.splice(oldDependantIndex as number, 1)

    if (dependantsTo?.length === 0) {
      dependants.delete(to)

      emptyDependants.dispatch(to)
    }

    if (dependenciesFrom?.length === 0) {
      dependencies.delete(from)
    }

    dependenciesChanged.dispatch()
  }

  const addDependency = (from: T, to: T) => {
    dependencies.set(from, [...dependencies.get(from) ?? [], to])
    dependants.set(to, [...dependants.get(to) ?? [], from])

    dependenciesChanged.dispatch()
  }

  const removeAllDependencies = (from: T) => {
    const dependenciesFrom = [...dependencies.get(from) ?? []]

    dependenciesFrom.forEach(to => {
      removeDependency(from, to)
    })
  }

  const withCurrentDependency = <TResult>(dependency: T, fn: () => TResult) => {
    const oldDependency = currentDependency
    currentDependency = dependency

    const result = fn()

    currentDependency = oldDependency

    return result
  }

  return {
    currentDependency: () => currentDependency,
    dependencies,
    dependants,
    on: {
      dependenciesChanged: dependenciesChanged.on,
      emptyDependants: emptyDependants.on
    },
    withCurrentDependency,
    addDependency,
    removeDependency,
    removeAllDependencies
  }
}
