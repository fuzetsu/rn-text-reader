import { Voice } from 'expo-speech'

export interface SavedState {
  value: string
  language: string
  voice: string
  pitch: string
  speed: string
  chunkIndex: number
  lightsOff: boolean
}

export interface TempState {
  loaded: boolean
  chunks: string[]
  voices: Voice[]
  filteredVoices: Voice[]
  languages: string[]
  reading: boolean
  editText: boolean
}

export type State = SavedState & TempState
