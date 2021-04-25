import React, { useEffect } from 'react'
import { StyleSheet, Text, StatusBar, ScrollView, TouchableOpacity, View } from 'react-native'
import * as Speech from 'expo-speech'
import * as DocumentPicker from 'expo-document-picker'
import { readAsStringAsync } from 'expo-file-system'
import Clipboard from 'expo-clipboard'

import {
  setChunkIndex,
  setEditText,
  setLanguage,
  setLightsOff,
  setPitch,
  setReading,
  setSpeed,
  setVoice,
  updateValue,
  useStore,
} from './state'
import { retryPromise, chunkStats } from './lib/util'
import { Label, Picker, TextInput, ButtonGroup, NumberUpDown, Button, TempState } from './base'
import { useDoublePress, useKeepAwake } from './lib/hooks'

export default function App() {
  const {
    value,
    language,
    voice,
    pitch,
    speed,
    chunkIndex,
    languages,
    filteredVoices,
    editText,
    lightsOff,
    reading,
    chunks,
  } = useStore()

  useKeepAwake(lightsOff)

  useEffect(() => {
    Speech.stop()
    if (!reading) {
      setLightsOff(false)
      return
    }

    const speak = (text: string) =>
      new Promise<'done' | 'stopped'>((resolve, reject) =>
        Speech.speak(text, {
          voice,
          rate: Number(speed) || 1,
          pitch: Number(pitch) || 1,
          onDone: () => resolve('done'),
          onStopped: () => resolve('stopped'),
          onError: reject,
        })
      )

    const readChunk = async () => {
      if (!chunks[chunkIndex]?.trim()) {
        setReading(false)
        return
      }

      const status = await retryPromise(2, () => speak(chunks[chunkIndex]))
      if (!cancel && status === 'done') {
        if (chunkIndex + 1 >= chunks.length) {
          if (chunks.length > 1) await speak(chunkStats(value, chunks))
          setReading(false)
          return
        }
        setChunkIndex(chunkIndex + 1)
      }
    }
    readChunk()

    let cancel = false
    return () => (cancel = true)
  }, [reading, chunkIndex, voice, pitch, speed, chunks, value])

  const setLightsOnDoublePress = useDoublePress(() => setLightsOff(false))

  if (lightsOff) {
    return (
      <>
        <StatusBar hidden />
        <TouchableOpacity style={styles.lightsOff} onPress={setLightsOnDoublePress} />
      </>
    )
  }

  const paste = () => Clipboard.getStringAsync().then(updateValue)

  const loadFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'text/*' })
    if (res.type === 'success') updateValue(await readAsStringAsync(res.uri))
  }

  if (editText) {
    return (
      <TempState value={value}>
        {(text, setText) => (
          <View style={styles.container}>
            <StatusBar />
            <Label text="Text to read" />
            <TextInput
              multiline
              style={{ flex: 1 }}
              placeholder="text to read"
              autoCorrect={false}
              value={text}
              onChangeText={setText}
            />
            <ButtonGroup>
              <Button
                primary
                text="Save"
                onPress={() => {
                  updateValue(text)
                  setEditText(false)
                }}
              />
              <Button text="Cancel" onPress={() => setEditText(false)} />
            </ButtonGroup>
          </View>
        )}
      </TempState>
    )
  }

  const loadingPicker = <Picker.Item value="" label="Loading..." />

  const readBtnLabel =
    (reading ? 'Stop' : 'Read') + (chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : '')

  return (
    <View style={styles.container}>
      <StatusBar />
      {!reading && (
        <>
          <ButtonGroup>
            <Button text="Paste" onPress={paste} />
            <Button text="Edit text" onPress={() => setEditText(true)} />
          </ButtonGroup>
          <ButtonGroup>
            <Button text="Load file" onPress={loadFile} />
            {value && <Button text="Clear" onPress={() => updateValue('')} />}
          </ButtonGroup>
        </>
      )}
      <Label text="Language" />
      <Picker selectedValue={language} onValueChange={setLanguage}>
        {languages.length > 0
          ? languages.map(x => <Picker.Item key={x} label={x} value={x} />)
          : loadingPicker}
      </Picker>
      <Label text="Voice" />
      <Picker selectedValue={voice} onValueChange={setVoice}>
        {filteredVoices.length > 0
          ? filteredVoices.map(x => (
              <Picker.Item key={x.identifier} label={x.name} value={x.identifier} />
            ))
          : loadingPicker}
      </Picker>
      <Label text="Pitch" />
      <NumberUpDown
        placeholder="voice pitch (default 1.0)"
        value={pitch}
        step="0.1"
        min="0.1"
        max="100"
        onChange={setPitch}
      />
      <Label text="Speed" />
      <NumberUpDown
        placeholder="voice speed (default 1.0)"
        value={speed}
        step="0.1"
        min="0.1"
        max="100"
        onChange={setSpeed}
      />
      {chunks.length > 0 && (
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
      )}
      {chunks.length > 1 && (
        <NumberUpDown
          noField
          value={chunkIndex}
          step="1"
          min="0"
          max={chunks.length - 1}
          onChange={x => setChunkIndex(Number(x))}
          minusText="<"
          plusText=">"
        />
      )}
      {chunks.length > 0 && (
        <ButtonGroup>
          <Button primary text={readBtnLabel} onPress={() => setReading(!reading)} />
          {reading && <Button text="Lights off" onPress={() => setLightsOff(true)} />}
        </ButtonGroup>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  textScroll: { flex: 1 },
  text: { marginTop: 5, fontSize: 17 },
  lightsOff: { backgroundColor: 'black', flex: 1 },
  container: { flex: 1, marginBottom: 10, padding: 10 },
})
