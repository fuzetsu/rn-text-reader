import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { Icon, IconProps } from '../base'
import { useBatteryLevel, useDoublePress, useKeepAwake } from '../lib/hooks'
import { useStore } from '../state'
import { setTextTop } from '../state/actions/dark-mode'
import { ReaderControls } from './ReaderControls'

type Stat = { icon: IconProps['name']; text: string }

const pad = (num: number) => ('00' + num).slice(-2)

export function DarkMode() {
  const [chunkIndex, chunks] = useStore([s => s.chunkIndex, s => s.chunks])
  const textTop = useStore(s => s.darkMode.textTop)

  const [showControls, setShowControls] = useState(true)

  const showControlsDoublePress = useDoublePress(() => setShowControls(true))

  const [batteryLevel, charging] = useBatteryLevel()

  useKeepAwake(true)

  if (!showControls) {
    return <TouchableOpacity style={styles.container} onPress={showControlsDoublePress} />
  }

  const readPercent = ((chunkIndex + 1) / chunks.length) * 100

  const date = new Date()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  const stats: Stat[] = [
    { icon: 'clock', text: time },
    { icon: 'book-play', text: readPercent.toFixed(0) + '%' },
    { icon: getBatteryIcon(Number(batteryLevel), charging), text: batteryLevel + '%' },
  ]

  return (
    <View style={styles.container}>
      <View style={[styles.fill, textTop && styles.reverse]}>
        <TouchableOpacity onPress={() => setTextTop(!textTop)} style={styles.fill} />
        <Text onPress={() => setShowControls(false)} style={styles.text}>
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

const getBatteryIcon = (battery: number, charging: boolean): IconProps['name'] => {
  if (isNaN(battery)) return 'battery-unknown'
  const extra = charging ? '-charging' : ''
  const level = Math.max(1, Math.round((battery / 100) * 10))
  const icon =
    !charging && level >= 10 ? 'battery' : (`battery${extra}-${level}0` as IconProps['name'])
  return icon
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
  statsText: { fontSize: 20, color: '#999' },
  stats: { marginVertical: 10, flexDirection: 'row', justifyContent: 'space-around' },
})
