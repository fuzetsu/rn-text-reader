import React from 'react'
import { ScrollView, Text, StyleSheet } from 'react-native'
import { Label, Picker } from '../base'
import { useStore } from '../state'
import { setChunkIndex } from '../state/actions'

export function ChunkPicker() {
  const [chunks, chunkIndex] = useStore([s => s.chunks, s => s.chunkIndex])

  if (chunks.length <= 0) return null

  return (
    <>
      <Label text="Chunk" />
      {chunks.length > 1 && (
        <Picker selectedValue={chunkIndex} onValueChange={setChunkIndex}>
          {chunks.map((chunk, idx) => (
            <Picker.Item key={chunk} label={`${idx + 1} - ${chunk.slice(0, 50)}`} value={idx} />
          ))}
        </Picker>
      )}
      <ScrollView style={styles.textScroll}>
        <Text style={styles.text}>{chunks[chunkIndex]?.trim()}</Text>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  textScroll: { flex: 1 },
  text: { marginTop: 5, fontSize: 17 },
})
