import React from 'react'
import staterino from 'staterino'
import merge from 'mergerino'
import { SavedState, State, TempState } from './type'
import { debounce, getSavedState, saveState } from '../lib/util'

export const savedState: SavedState = {
  value: 'An old silent pond.\nA frog jumps into the pond.\nSplash! Silence again.',
  language: 'en-US',
  voice: 'en-us-x-tpd-network',
  pitch: '1',
  speed: '1',
  chunkIndex: 0,
  lightsOff: false,
}
const SAVED_STATE_KEYS = Object.keys(savedState)

export const tempState: TempState = {
  loaded: false,
  chunks: [],
  voices: [],
  filteredVoices: [],
  languages: [],
  reading: false,
  editText: false,
}

export const initialState: State = { ...savedState, ...tempState }

export const useStore = staterino({ state: initialState, hooks: React, merge })

const storeKey = '@our-state'

const { set, subscribe } = useStore

// restore saved state
getSavedState(storeKey).then((state: SavedState) => set([state, tempState, { loaded: true }]))

// persist state changes
subscribe(
  debounce(1000, (state: State) => {
    const filteredState = SAVED_STATE_KEYS.reduce((acc, key) => ({ ...acc, [key]: state[key] }), {})
    saveState(storeKey, filteredState)
  })
)
