import React, { useEffect, useState } from 'react'
import * as Updates from 'expo-updates'
import { Alert } from 'react-native'
import { Button } from '../base'

export function UpdateButton() {
  const [hasUpdate, setHasUpdate] = useState(false)
  useEffect(() => {
    Updates.checkForUpdateAsync().then(({ isAvailable }) => setHasUpdate(isAvailable))
    const listener = Updates.addListener(({ type }) =>
      setHasUpdate(type === Updates.UpdateEventType.UPDATE_AVAILABLE)
    )
    return () => listener.remove()
  }, [])

  if (!hasUpdate) return null

  const update = async () => {
    const { isNew } = await Updates.fetchUpdateAsync()
    if (isNew) await Updates.reloadAsync()
    else Alert.alert('Never mind', 'Turns out app was already up to date')
  }

  return <Button text="New update, tap to reload" icon={{ name: 'update' }} onPress={update} />
}
