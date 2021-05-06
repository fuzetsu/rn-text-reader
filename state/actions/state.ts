import { setState } from '../state'
import { State } from '../type'
import { KeySetter } from './types'

const setter: KeySetter<State> = key => value => setState({ [key]: value })

export const setLanguage = setter('language')
export const setVoice = setter('voice')
export const setPitch = setter('pitch')
export const setSpeed = setter('speed')
export const setChunkIndex = setter('chunkIndex')
export const setReading = setter('reading')
export const setEditText = setter('editText')

export const updateValue = (value: string) => setState({ value, chunkIndex: 0 })
