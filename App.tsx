import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import * as Speech from 'expo-speech'
import * as DocumentPicker from 'expo-document-picker'
import { readAsStringAsync } from 'expo-file-system'
import merge, { MultipleTopLevelPatch } from 'mergerino'
import Clipboard from 'expo-clipboard'

import { initialState, State } from './state'
import {
  getVoices,
  retryPromise,
  getSavedState,
  saveState,
  chunkText,
  chunkStats,
} from './lib/util'
import { Label, Picker, TextInput, ButtonGroup, NumberUpDown, Button, TempState } from './base'
import { useDoublePress, useKeepAwake } from './lib/hooks'

export default function App() {
  const [state, setState] = useReducer(
    (state: State, patch: MultipleTopLevelPatch<State>) => merge(state, patch),
    initialState
  )
  const { value, language, voice, pitch, rate, chunkIndex } = state

  const [chunks, setChunks] = useState<string[]>([])
  const [voices, setVoices] = useState<Speech.Voice[]>([])
  const [filteredVoices, setFilteredVoices] = useState<Speech.Voice[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [reading, setReading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [lightsOff, setLightsOff] = useState(false)
  const [editText, setEditText] = useState(false)

  useKeepAwake(lightsOff)

  useEffect(() => {
    if (!loaded) return
    const id = setTimeout(() => saveState(state), 500)
    return () => clearTimeout(id)
  }, [loaded, state])

  useEffect(() => {
    getSavedState().then((state) => {
      setState(state)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    const search = async () => {
      const { voices, languages } = await retryPromise(3, () => getVoices())
      setLanguages(languages)
      if (!languages.includes(language)) setState({ language: languages[0] })
      setVoices(voices)
    }
    search()
  }, [loaded])

  useEffect(() => {
    if (!language || voices.length <= 0) return
    const filtered = voices.filter((voice) => voice.language === language)
    setFilteredVoices(filtered)
    if (filtered.length > 0 && filtered.every((x) => x.identifier !== voice)) {
      setState({ voice: filtered[0].identifier })
    }
  }, [language, voices])

  useEffect(() => {
    if (!loaded) return
    const chunks = chunkText(value)
    setReading(false)
    setChunks(chunks)
    setState({ chunkIndex: chunkIndex >= chunks.length ? 0 : chunkIndex })
  }, [value, loaded])

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
          rate: Number(rate) || 1,
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
        setState({ chunkIndex: chunkIndex + 1 })
      }
    }
    readChunk()

    let cancel = false
    return () => (cancel = true)
  }, [reading, chunkIndex, voice, pitch, rate, chunks])

  const setLightsOnDoublePress = useDoublePress(() => setLightsOff(false))

  if (lightsOff) {
    return (
      <>
        <StatusBar hidden />
        <TouchableOpacity style={styles.lightsOff} onPress={setLightsOnDoublePress} />
      </>
    )
  }

  const changeValue = (value: string) => setState({ value, chunkIndex: 0 })

  const paste = () => Clipboard.getStringAsync().then(changeValue)

  const loadFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'text/*' })
    if (res.type === 'success') changeValue(await readAsStringAsync(res.uri))
  }

  if (editText) {
    return (
      <TempState value={value}>
        {(text, setText) => (
          <>
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
                text="Save"
                onPress={() => {
                  changeValue(text)
                  setEditText(false)
                }}
              />
              <Button text="Cancel" onPress={() => setEditText(false)} />
            </ButtonGroup>
          </>
        )}
      </TempState>
    )
  }

  const loadingPicker = <Picker.Item value="" label="Loading..." />

  const readBtnLabel =
    (reading ? 'Stop' : 'Read') + (chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : '')

  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <ButtonGroup>
        {chunks.length > 0 && <Button text={readBtnLabel} onPress={() => setReading(!reading)} />}
        {reading && <Button text="Lights off" onPress={() => setLightsOff(true)} />}
        {!reading && value && <Button text="Clear" onPress={() => changeValue('')} />}
      </ButtonGroup>
      {!reading && (
        <ButtonGroup>
          <Button text="Paste" onPress={paste} />
          <Button text="Edit text" onPress={() => setEditText(true)} />
          <Button text="Load file" onPress={loadFile} />
        </ButtonGroup>
      )}
      <Label text="Language" />
      <Picker selectedValue={language} onValueChange={(x) => setState({ language: x })}>
        {languages.length > 0
          ? languages.map((language) => (
              <Picker.Item key={language} label={language} value={language} />
            ))
          : loadingPicker}
      </Picker>
      <Label text="Voice" />
      <Picker selectedValue={voice} onValueChange={(x) => setState({ voice: x })}>
        {filteredVoices.length > 0
          ? filteredVoices.map((voice) => (
              <Picker.Item key={voice.identifier} label={voice.name} value={voice.identifier} />
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
        onChange={(x) => setState({ pitch: x })}
      />
      <Label text="Speed" />
      <NumberUpDown
        placeholder="voice speed (default 1.0)"
        value={rate}
        step="0.1"
        min="0.1"
        max="100"
        onChange={(x) => setState({ rate: x })}
      />
      {chunks.length > 0 && <Label text="Chunk" />}
      {chunks.length > 1 && (
        <>
          <Picker selectedValue={chunkIndex} onValueChange={(x) => setState({ chunkIndex: x })}>
            {chunks.map((chunk, idx) => (
              <Picker.Item key={chunk} label={`${idx + 1} - ${chunk.slice(0, 50)}`} value={idx} />
            ))}
          </Picker>
          <NumberUpDown
            noField
            value={chunkIndex}
            style={{ marginTop: 4 }}
            step="1"
            min="0"
            max={chunks.length - 1}
            onChange={(x) => setState({ chunkIndex: Number(x) })}
            minusText="<"
            plusText=">"
          />
        </>
      )}
      <Text style={{ marginTop: 5 }}>{chunks[chunkIndex]?.trim()}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  lightsOff: {
    backgroundColor: 'black',
    flex: 1,
  },
  container: {
    marginBottom: 20,
    padding: 10,
  },
})
