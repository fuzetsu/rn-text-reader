import React from 'react'
import { StyleSheet, StatusBar, View, useColorScheme } from 'react-native'

import { useStore } from './state'
import {
  ChunkControls,
  EditText,
  LightsOff,
  LoadText,
  ReaderControls,
  SpeechService,
  VoiceControls,
} from './cmp'

export default function App() {
  const [editText, lightsOff] = useStore([s => s.editText, s => s.lightsOff])

  const colorScheme = useColorScheme()
  const containerStyle = [
    styles.container,
    { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' },
    lightsOff && { padding: 0 },
  ]

  return (
    <View style={containerStyle}>
      <StatusBar hidden={lightsOff} />
      <SpeechService />
      {lightsOff ? (
        <LightsOff />
      ) : editText ? (
        <EditText />
      ) : (
        <>
          <LoadText />
          <VoiceControls />
          <ChunkControls />
          <ReaderControls />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
})
