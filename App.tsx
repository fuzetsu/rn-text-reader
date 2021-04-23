import React, { useState, useEffect, useReducer } from 'react'
import { StyleSheet, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import * as Speech from 'expo-speech'
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
import { Label, Picker, TextInput, ButtonGroup, NumberUpDown, Button } from './base'
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
    if (!reading) return

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
          if (chunks.length > 1) return speak(chunkStats(value, chunks))
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

  const lightsOn = useDoublePress(() => setLightsOff(false))

  if (lightsOff) {
    return (
      <>
        <StatusBar hidden />
        <TouchableOpacity style={styles.lightsOff} onPress={lightsOn} />
      </>
    )
  }

  const loadingPicker = <Picker.Item value="" label="Loading..." />

  const readBtnLabel =
    (reading ? 'Stop' : 'Read') + (chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : '')

  const paste = () => Clipboard.getStringAsync().then((x) => setState({ value: x, chunkIndex: 0 }))

  return (
    <ScrollView style={styles.container}>
      {!reading && (
        <>
          <Label text="Read" />
          <TextInput
            multiline
            style={{ height: 100 }}
            placeholder="text to read"
            autoCorrect={false}
            value={value}
            onChangeText={(x) => setState({ value: x })}
          />
        </>
      )}
      <ButtonGroup>
        <Button text={readBtnLabel} onPress={() => setReading(!reading)} />
        {reading ? (
          <Button text="Lights off" onPress={() => setLightsOff(true)} />
        ) : (
          <Button text="Paste" onPress={paste} />
        )}
      </ButtonGroup>
      <Label text="Language" />
      <Picker selectedValue={language} onValueChange={(x: string) => setState({ language: x })}>
        {languages.length > 0
          ? languages.map((language) => (
              <Picker.Item key={language} label={language} value={language} />
            ))
          : loadingPicker}
      </Picker>
      <Label text="Voice" />
      <Picker selectedValue={voice} onValueChange={(x: string) => setState({ voice: x })}>
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
      {chunks.length > 1 && (
        <>
          <Label text="Chunk" />
          <Picker
            selectedValue={chunkIndex}
            onValueChange={(x) => setState({ chunkIndex: Number(x) })}
          >
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
          <Text style={{ marginTop: 5 }}>{chunks[chunkIndex]?.trim()}</Text>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  lightsOff: {
    backgroundColor: 'black',
    flex: 1,
  },
  container: {
    marginTop: StatusBar.currentHeight,
    marginBottom: 10,
    padding: 10,
  },
})
