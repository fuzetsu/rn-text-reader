import React, { useEffect, useState } from 'react'
import * as Updates from 'expo-updates'
import { Alert } from 'react-native'
import { Button } from '../base'

export function UpdateButton() {
  const [hasUpdate, setHasUpdate] = useState(false)
  useEffect(() => {
    if (__DEV__) return
    Updates.checkForUpdateAsync().then(({ isAvailable }) => setHasUpdate(isAvailable))
    const listener = Updates.addListener(({ type }) =>
      setHasUpdate(type === Updates.UpdateEventType.UPDATE_AVAILABLE)
    )
    return () => listener.remove()
  }, [])

  const [fetching, setFetching] = useState(false)

  if (!hasUpdate) return null

  const update = async () => {
    setFetching(true)
    const { isNew } = await Updates.fetchUpdateAsync()
    setFetching(false)
    if (isNew) await Updates.reloadAsync()
    else Alert.alert('Never mind', 'Turns out app was already up to date.')
  }

  return (
    <Button
      text="New update, tap to reload"
      icon="cloud-download"
      onPress={update}
      disabled={fetching}
    />
  )
}
