import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Button, ButtonGroup } from '../base'
import { useDoublePress, useKeepAwake } from '../lib/hooks'
import { nextIndex } from '../lib/util'
import { useStore } from '../state'
import { setChunkIndex, setLightsOff, setReading } from '../state/actions'

const MODES = ['on', 'on-reverse', 'off'] as const
type Mode = typeof MODES[number]

export function LightsOff() {
  const [chunkIndex, chunks, reading] = useStore([s => s.chunkIndex, s => s.chunks, s => s.reading])
  const closeOnDoublePress = useDoublePress(() => setLightsOff(false))
  const [mode, setMode] = useState<Mode>('off')

  useKeepAwake(true)

  const chunkProgress = () => {
    const percent = ((chunkIndex + 1) / chunks.length) * 100
    return `${chunkIndex + 1}/${chunks.length} – ${percent.toFixed(1)}%`
  }

  return (
    <TouchableOpacity
      style={[styles.container, mode === 'on-reverse' && { flexDirection: 'column-reverse' }]}
      onPress={() => {
        closeOnDoublePress()
        setMode(MODES[nextIndex(MODES, MODES.indexOf(mode))])
      }}
    >
      {mode !== 'off' && (
        <>
          <Text style={styles.text}>{chunks[chunkIndex]?.trim()}</Text>
          <Text style={styles.readPercentage}>{chunkProgress()}</Text>
          <ButtonGroup>
            <Button
              plain
              text="<"
              textStyle={styles.text}
              disabled={chunkIndex <= 0}
              onPress={() => setChunkIndex(chunkIndex - 1)}
            />
            <Button plain text={reading ? 'Stop' : 'Read'} onPress={() => setReading(!reading)} />
            <Button
              plain
              text=">"
              textStyle={styles.text}
              disabled={chunkIndex >= chunks.length - 1}
              onPress={() => setChunkIndex(chunkIndex + 1)}
            />
          </ButtonGroup>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
