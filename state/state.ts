import React from 'react'
import staterino from 'staterino'
import merge from 'mergerino'
import { SavedState, State, TempState } from './type'

export const savedState: SavedState = {
  value: 'An old silent pond.\nA frog jumps into the pond.\nSplash! Silence again.',
  language: 'en-US',
  voice: 'en-us-x-tpd-network',
  pitch: '1',
  speed: '1',
  chunkIndex: 0,
}

export const tempState: TempState = {
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
