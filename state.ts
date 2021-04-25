import React from 'react'
import staterino from 'staterino'
import merge, { FunctionPatch } from 'mergerino'
import * as Speech from 'expo-speech'
import { chunkText, debounce, getSavedState, getVoices, retryPromise, saveState } from './lib/util'
import { TempState } from './base'

const storeKey = '@our-state'

export interface SavedState {
  value: string
  language: string
  voice: string
  pitch: string
  speed: string
  chunkIndex: number
}

export interface TempState {
  loaded: boolean
  chunks: string[]
  voices: Speech.Voice[]
  filteredVoices: Speech.Voice[]
  languages: string[]
  reading: boolean
  lightsOff: boolean
  editText: boolean
}

export type State = SavedState & TempState

const savedState: SavedState = {
  value: 'An old silent pond.\nA frog jumps into the pond.\nSplash! Silence again.',
  language: 'en-US',
  voice: 'en-us-x-tpd-network',
  pitch: '1',
  speed: '1',
  chunkIndex: 0,
}

const tempState: TempState = {
  loaded: false,
  chunks: [],
  voices: [],
  filteredVoices: [],
  languages: [],
  reading: false,
  lightsOff: false,
  editText: false,
}

export const initialState: State = { ...savedState, ...tempState }

export const useStore = staterino({ state: initialState, hooks: React, merge })

const { set, subscribe } = useStore

const setter = <K extends keyof State>(key: K) => (value: State[K] | FunctionPatch<State[K]>) =>
  set({ [key]: value })

export const setLanguage = setter('language')
export const setVoice = setter('voice')
export const setPitch = setter('pitch')
export const setSpeed = setter('speed')
export const setChunkIndex = setter('chunkIndex')
export const setReading = setter('reading')
export const setLightsOff = setter('lightsOff')
export const setEditText = setter('editText')

export const updateValue = (value: string) => set({ value, chunkIndex: 0 })

// restore saved state
getSavedState(storeKey).then((state: SavedState) => set([state, tempState, { loaded: true }]))

// fetch voices/languages on load
subscribe(
  s => s.loaded,
  loaded => {
    if (!loaded) return
    retryPromise(3, getVoices).then(({ voices, languages }) =>
      set({ languages, voices, language: x => (languages.includes(x) ? x : languages[0]) })
    )
  }
)

// sync language choices
subscribe([s => s.language, s => s.voices], (language, voices) => {
  if (!language || voices.length <= 0) return
  const filteredVoices = voices.filter(voice => voice.language === language)
  set({
    filteredVoices,
    voice: voice =>
      filteredVoices.some(x => x.identifier === voice) ? voice : filteredVoices[0].identifier,
  })
})

// chunk text when value changes
subscribe([s => s.loaded, s => s.value], (loaded, value) => {
  if (!loaded) return
  const chunks = chunkText(value)
  set({ reading: false, chunks, chunkIndex: x => (x >= chunks.length ? 0 : x) })
})

// re-save state whenever it changes
const debouncedSaveState = debounce(1000, (state: State) => {
  console.log('saving state!')
  const filteredState = Object.keys(savedState).reduce(
    (acc, key) => ({ ...acc, [key]: state[key] }),
    {}
  )
  saveState(storeKey, filteredState)
})
subscribe(debouncedSaveState)
