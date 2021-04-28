import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useDoublePress, useKeepAwake } from '../lib/hooks'
import { useStore } from '../state'
import { setLightsOff } from '../state/actions'

export function LightsOff() {
  const [chunkIndex, chunks] = useStore([s => s.chunkIndex, s => s.chunks])
  const closeOnDoublePress = useDoublePress(() => setLightsOff(false))
  const [showText, setShowText] = useState(false)

  useKeepAwake(true)

  const chunkProgress = () => {
    const percent = ((chunkIndex + 1) / chunks.length) * 100
    return `${chunkIndex + 1}/${chunks.length} – ${percent.toFixed(1)}%`
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        closeOnDoublePress()
        setShowText(!showText)
      }}
    >
      {showText && (
        <>
          <Text style={[styles.text, styles.readPercentage]}>{chunkProgress()}</Text>
          <Text style={styles.text}>{chunks[chunkIndex]?.trim()}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 15,
  },
  text: { fontSize: 22, color: 'white' },
  readPercentage: { color: '#999', textAlign: 'center', marginBottom: 20 },
})
