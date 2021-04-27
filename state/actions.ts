import { FunctionPatch } from 'mergerino'
import { useStore } from './state'
import { State } from './type'

const { set } = useStore

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
