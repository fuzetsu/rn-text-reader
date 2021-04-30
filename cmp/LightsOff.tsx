import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { useDoublePress, useKeepAwake } from '../lib/hooks'
import { useStore } from '../state'
import { ReaderControls } from './ReaderControls'

type Mode = 'on' | 'on-reverse' | 'off'

export function LightsOff() {
  const [chunkIndex, chunks] = useStore([s => s.chunkIndex, s => s.chunks])
  const [mode, setMode] = useState<Mode>('off')

  const setOnDoublePress = useDoublePress(() => setMode('on'))

  useKeepAwake(true)

  const chunkProgress = () => {
    const percent = ((chunkIndex + 1) / chunks.length) * 100
    return `${chunkIndex + 1}/${chunks.length} – ${percent.toFixed(1)}%`
  }

  return (
    <View style={[styles.container, mode === 'on-reverse' && styles.reverse]}>
      {mode === 'off' ? (
        <TouchableOpacity style={styles.emptySpace} onPress={setOnDoublePress} />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setMode(mode === 'on' ? 'on-reverse' : 'on')}
            style={styles.emptySpace}
          />
          <Text onPress={() => setMode('off')} style={styles.text}>
            {chunks[chunkIndex]?.trim()}
          </Text>
          <Text style={styles.readPercentage}>{chunkProgress()}</Text>
          <ReaderControls plain />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  emptySpace: { flex: 1 },
  reverse: { flexDirection: 'column-reverse' },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    padding: 15,
  },
  text: { fontSize: 24, color: 'white' },
  readPercentage: {
    fontSize: 20,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
})
