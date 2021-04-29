import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Button, ButtonGroup, NumberUpDown } from '../base'
import { useKeepAwake } from '../lib/hooks'
import { nextIndex } from '../lib/util'
import { useStore } from '../state'
import { setChunkIndex, setLightsOff, setReading } from '../state/actions'

const MODES = ['on', 'on-reverse', 'off'] as const
type Mode = typeof MODES[number]

export function LightsOff() {
  const [chunkIndex, chunks, reading] = useStore([s => s.chunkIndex, s => s.chunks, s => s.reading])
  const [mode, setMode] = useState<Mode>('off')

  useKeepAwake(true)

  const chunkProgress = () => {
    const percent = ((chunkIndex + 1) / chunks.length) * 100
    return `${chunkIndex + 1}/${chunks.length} – ${percent.toFixed(1)}%`
  }

  const cycleMode = () => setMode(MODES[nextIndex(MODES, MODES.indexOf(mode))])

  return (
    <TouchableOpacity
      style={[styles.container, mode === 'on-reverse' && styles.reverse]}
      onPress={cycleMode}
    >
      {mode !== 'off' && (
        <>
          <Text style={styles.text}>{chunks[chunkIndex]?.trim()}</Text>
          <Text style={styles.readPercentage}>{chunkProgress()}</Text>
          <NumberUpDown
            plain
            noField
            step="1"
            min="0"
            max={chunks.length - 1}
            minusText="<"
            plusText=">"
            value={chunkIndex}
            onChange={index => setChunkIndex(Number(index))}
          />
          <ButtonGroup>
            <Button plain text={reading ? 'Stop' : 'Read'} onPress={() => setReading(!reading)} />
            <Button plain text="Lights on" onPress={() => setLightsOff(false)} />
          </ButtonGroup>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
