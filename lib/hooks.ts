import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { useCallback, useEffect, useRef } from 'react'
import { genId } from './util'

export const useKeepAwake = (keepAwake: boolean) => {
  useEffect(() => {
    if (!keepAwake) return
    const id = genId()
    activateKeepAwake(id)
    return () => deactivateKeepAwake(id)
  }, [keepAwake])
}

export const useDoublePress = <T extends () => void>(fn: T) => {
  const lastPress = useRef(0)
  return useCallback(() => {
    if (Date.now() - lastPress.current < 200) fn()
    lastPress.current = Date.now()
  }, [])
}
