import { useState, SetStateAction, Dispatch } from 'react'

interface Props<T> {
  value: T
  children: (value: T, setValue: Dispatch<SetStateAction<T>>) => JSX.Element
}

export function TempState<T>({ value: initialState, children }: Props<T>) {
  return children(...useState(initialState))
}
