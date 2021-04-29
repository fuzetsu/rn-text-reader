import React from 'react'
import Clipboard from 'expo-clipboard'
import { getDocumentAsync } from 'expo-document-picker'

import { ButtonGroup, Button } from '../base'
import { useStore } from '../state'
import { setEditText, updateValue } from '../state/actions'

import { readAsStringAsync } from 'expo-file-system'

export function TextControls() {
  const [reading, hasValue] = useStore([s => s.reading, s => Boolean(s.value)])

  if (reading) return null

  return (
    <>
      <ButtonGroup>
        <Button text="Paste" onPress={paste} />
        <Button text="Edit text" onPress={() => setEditText(true)} />
      </ButtonGroup>
      <ButtonGroup>
        <Button text="Load file" onPress={loadFile} />
        {hasValue && <Button text="Clear" onPress={() => updateValue('')} />}
      </ButtonGroup>
    </>
  )
}

const paste = () => Clipboard.getStringAsync().then(updateValue)

const loadFile = async () => {
  const res = await getDocumentAsync({ type: 'text/*' })
  if (res.type === 'success') updateValue(await readAsStringAsync(res.uri))
}
