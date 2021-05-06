import { setState } from '../state'
import { State } from '../type'
import { KeySetter } from './types'

const setter: KeySetter<State['darkMode']> = key => value =>
  setState({ darkMode: { [key]: value } })

export const setTextTop = setter('textTop')
export const setEnabled = setter('enabled')
export const setShowControls = setter('showControls')
