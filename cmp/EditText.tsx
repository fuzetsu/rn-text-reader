import React, { useState } from 'react'
import { Label, ButtonGroup, Button, TextInput } from '../base'
import { useStore } from '../state'
import { updateValue, setEditText } from '../state/actions'

export function EditText() {
  const [text, setText] = useState(() => useStore.get().value)
  return (
    <>
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
          type="primary"
          icon="floppy"
          text="Save"
          onPress={() => {
            updateValue(text)
            setEditText(false)
          }}
        />
        <Button icon="cancel" text="Cancel" onPress={() => setEditText(false)} />
      </ButtonGroup>
    </>
  )
}
