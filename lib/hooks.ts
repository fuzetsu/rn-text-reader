import * as Battery from 'expo-battery'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { genId } from './util'

export const useKeepAwake = (keepAwake: boolean) => {
  useEffect(() => {
    if (!keepAwake) return
    const id = genId()
    activateKeepAwake(id)
    return () => deactivateKeepAwake(id)
  }, [keepAwake])
}

export const useUpdatingRef = <T>(value: T) => {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export const useDoublePress = <T extends () => void>(fn: T) => {
  const fnRef = useUpdatingRef(fn)

  const lastPress = useRef(0)
  return useCallback(() => {
    if (Date.now() - lastPress.current < 300) fnRef.current()
    lastPress.current = Date.now()
  }, [fnRef])
}

export const useBatteryLevel = (): [battery: string, charging: boolean] => {
  const [charging, setCharging] = useState(false)
  useEffect(() => {
    const updateCharging = (state: Battery.BatteryState) =>
      setCharging(state === Battery.BatteryState.CHARGING)
    const fetchCharging = () => Battery.getBatteryStateAsync().then(updateCharging)
    fetchCharging()

    const listener = Battery.addBatteryStateListener(({ batteryState }) =>
      updateCharging(batteryState)
    )
    return () => listener.remove()
  }, [])

  const [battery, setBattery] = useState('')
  useEffect(() => {
    const updateBattery = (level: number) => setBattery((level * 100).toFixed(0))

    const fetchLevel = () => Battery.getBatteryLevelAsync().then(updateBattery)
    fetchLevel()

    // android only fires update event on big level changes, so just poll
    if (Platform.OS === 'android') {
      const id = window.setInterval(fetchLevel, 1000 * 60 * 2)
      return () => window.clearInterval(id)
    }

    const listener = Battery.addBatteryLevelListener(({ batteryLevel }) =>
      updateBattery(batteryLevel)
    )
    return () => listener.remove()
  }, [])
  return [battery, charging]
}
