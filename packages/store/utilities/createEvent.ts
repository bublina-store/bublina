export const createEvent = <TEvent = never>() => {
  type Handler = (event: TEvent) => void

  const handlers = new Set<Handler>()

  const on = (handler: (event: TEvent) => void) => {
    handlers.add(handler)
    return () => {
      handlers.delete(handler)
    }
  }

  const dispatch = (...args: [TEvent] extends [never] ? [unknown?] : [TEvent]) => {
    handlers.forEach(handler => handler(args[0] as TEvent))
  }

  return {
    on,
    dispatch
  }
}
