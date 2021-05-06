import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import * as Speech from 'expo-speech'
import * as Notifications from 'expo-notifications'
import { useStore } from '../state'
import { retryPromise, chunkStats } from '../lib/util'
import { setReading, setChunkIndex } from '../state/actions'
import { setEnabled as setDarkModeEnabled } from '../state/actions/dark-mode'

Notifications.setNotificationCategoryAsync('reader-controls-start', [
  { buttonTitle: 'Start', identifier: 'start', options: { opensAppToForeground: false } },
])

Notifications.setNotificationCategoryAsync('reader-controls-stop', [
  { buttonTitle: 'Stop', identifier: 'stop', options: { opensAppToForeground: false } },
])

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  },
})

const NOTIFICATION_ID = 'reader-controls'

export function SpeechService() {
  const { reading, speed, pitch, chunks, chunkIndex, value, voice } = useStore()

  useEffect(() => {
    Speech.stop()
    if (!reading) return

    const speak = (text: string) =>
      new Promise<'done' | 'stopped'>((resolve, reject) =>
        Speech.speak(text, {
          voice,
          rate: Number(speed) || 1,
          pitch: Number(pitch) || 1,
          onDone: () => resolve('done'),
          onStopped: () => resolve('stopped'),
          onError: reject,
        })
      )

    const readChunk = async () => {
      if (!chunks[chunkIndex]?.trim()) {
        setReading(false)
        return
      }

      const status = await retryPromise(5, () => speak(chunks[chunkIndex])).catch(() => {
        setReading(false)
        Alert.alert('Error', 'Something went wrong while trying to speak.')
      })
      if (!cancel && status === 'done') {
        if (chunkIndex + 1 >= chunks.length) {
          if (chunks.length > 1) await speak(chunkStats(value, chunks))
          setDarkModeEnabled(false)
          setReading(false)
          return
        }
        setChunkIndex(chunkIndex + 1)
      }
    }
    readChunk()

    let cancel = false
    return () => (cancel = true)
  }, [reading, chunkIndex, voice, pitch, speed, chunks, value])

  // get permissions for notifications
  const [canNotify, setCanNotify] = useState(false)
  useEffect(() => {
    Notifications.getPermissionsAsync()
      .then(res => (res.status === 'granted' ? res : Notifications.requestPermissionsAsync()))
      .then(res => setCanNotify(res.status === 'granted'))

    const sub = Notifications.addNotificationResponseReceivedListener(event => {
      if (event.actionIdentifier === 'stop') setReading(false)
      else if (event.actionIdentifier === 'start') setReading(true)
    })

    return () => sub.remove()
  }, [])

  // show reader control notification
  useEffect(() => {
    if (!canNotify || chunks.length <= 0) return
    Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        categoryIdentifier: reading ? 'reader-controls-stop' : 'reader-controls-start',
        title: `${reading ? 'Reading' : 'Read'} ${chunks.length} chunks`,
        autoDismiss: false,
      },
      trigger: null,
    })
    return () => Notifications.dismissNotificationAsync(NOTIFICATION_ID)
  }, [canNotify, reading, chunks])

  return null
}
