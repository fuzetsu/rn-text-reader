import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { Icon, IconProps } from '../base'
import { useBatteryLevel, useDoublePress, useKeepAwake } from '../lib/hooks'
import { useStore } from '../state'
import { ReaderControls } from './ReaderControls'

type Stat = { icon: IconProps['name']; text: string }

const pad = (num: number) => ('00' + num).slice(-2)

export function LightsOff() {
  const [chunkIndex, chunks] = useStore([s => s.chunkIndex, s => s.chunks])
  const [dark, setDark] = useState(true)
  const [textTop, setTextTop] = useState(false)

  const setOnDoublePress = useDoublePress(() => setDark(false))

  const batteryLevel = useBatteryLevel()

  useKeepAwake(true)

  if (dark) return <TouchableOpacity style={styles.container} onPress={setOnDoublePress} />

  const readPercent = ((chunkIndex + 1) / chunks.length) * 100

  const date = new Date()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  const stats: Stat[] = [
    { icon: 'clock', text: time },
    { icon: 'book-play', text: readPercent.toFixed(0) + '%' },
    { icon: getBatteryIcon(Number(batteryLevel)), text: batteryLevel + '%' },
  ]

  return (
    <View style={styles.container}>
      <View style={[styles.fill, textTop && styles.reverse]}>
        <TouchableOpacity onPress={() => setTextTop(!textTop)} style={styles.fill} />
        <Text onPress={() => setDark(true)} style={styles.text}>
          {chunks[chunkIndex]?.trim()}
        </Text>
      </View>
      <View style={styles.stats}>
        {stats.map(({ icon, text }, index) => (
          <Text key={index} style={styles.statsText}>
            <Icon name={icon} size={18} /> {text}
          </Text>
        ))}
      </View>
      <ReaderControls plain />
    </View>
  )
}

const getBatteryIcon = (battery: number): IconProps['name'] => {
  if (isNaN(battery)) return 'battery-alert'
  return battery >= 100
    ? 'battery'
    : (`battery-${Math.ceil((battery / 100) * 10)}0` as IconProps['name'])
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  reverse: { flexDirection: 'column-reverse' },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    padding: 10,
  },
  text: { fontSize: 24, color: 'white' },
  statsText: {
    fontSize: 20,
    color: '#999',
  },
  stats: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
