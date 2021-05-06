import { FunctionPatch } from 'mergerino'

export type KeySetter<T> = <K extends keyof T>(
  key: K
) => (value: T[K] | FunctionPatch<T[K]>) => void
