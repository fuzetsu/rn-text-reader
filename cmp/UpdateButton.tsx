import React, { useEffect, useState } from 'react'
import * as Updates from 'expo-updates'
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

  const update = () => Updates.reloadAsync()

  return <Button text="New update, tap to reload" icon={{ name: 'update' }} onPress={update} />
}
