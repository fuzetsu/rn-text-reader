import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { useDoublePress, useKeepAwake } from '../lib/hooks'
import { useStore } from '../state'
import { ReaderControls } from './ReaderControls'

const pad = (num: number) => ('00' + num).slice(-2)

export function LightsOff() {
  const [chunkIndex, chunks] = useStore([s => s.chunkIndex, s => s.chunks])
  const [dark, setDark] = useState(true)
  const [textTop, setTextTop] = useState(false)

  const setOnDoublePress = useDoublePress(() => setDark(false))

  useKeepAwake(true)

  if (dark) return <TouchableOpacity style={styles.container} onPress={setOnDoublePress} />

  const percent = ((chunkIndex + 1) / chunks.length) * 100

  const date = new Date()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  return (
    <View style={styles.container}>
      <View style={[styles.fill, textTop && styles.reverse]}>
        <TouchableOpacity onPress={() => setTextTop(!textTop)} style={styles.fill} />
        <Text onPress={() => setDark(true)} style={styles.text}>
          {chunks[chunkIndex]?.trim()}
        </Text>
      </View>
      <Text style={styles.readPercentage}>
        {percent.toFixed(0)}% – {time}
      </Text>
      <ReaderControls plain />
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
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
