import React from 'react'
import { StyleSheet, StatusBar, View, useColorScheme } from 'react-native'

import { useStore } from './state'
import {
  ChunkPicker,
  EditText,
  DarkMode,
  TextControls,
  ReaderControls,
  SpeechService,
  VoiceControls,
  UpdateButton,
} from './cmp'

export default function App() {
  const [editText, darkMode] = useStore([s => s.editText, s => s.darkMode.enabled])

  const colorScheme = useColorScheme()
  const containerStyle = [
    styles.container,
    { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' },
    darkMode && { padding: 0 },
  ]

  return (
    <View style={containerStyle}>
      <StatusBar hidden={darkMode} />
      <SpeechService />
      {darkMode ? (
        <DarkMode />
      ) : editText ? (
        <EditText />
      ) : (
        <>
          <TextControls />
          <VoiceControls />
          <ChunkPicker />
          <ReaderControls />
          <UpdateButton />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 10 } })
