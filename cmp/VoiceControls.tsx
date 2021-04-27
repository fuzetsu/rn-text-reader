import React from 'react'
import { Label, NumberUpDown, Picker } from '../base'
import { useStore } from '../state'
import { setLanguage, setPitch, setSpeed, setVoice } from '../state/actions'

export function VoiceControls() {
  const { language, languages, voice, filteredVoices, pitch, speed } = useStore()

  const loadingPicker = <Picker.Item value="" label="Loading..." />

  return (
    <>
      <Label text="Language" />
      <Picker selectedValue={language} onValueChange={setLanguage}>
        {languages.length > 0
          ? languages.map(x => <Picker.Item key={x} label={x} value={x} />)
          : loadingPicker}
      </Picker>
      <Label text="Voice" />
      <Picker selectedValue={voice} onValueChange={setVoice}>
        {filteredVoices.length > 0
          ? filteredVoices.map(x => (
              <Picker.Item key={x.identifier} label={x.name} value={x.identifier} />
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
        onChange={setPitch}
      />
      <Label text="Speed" />
      <NumberUpDown
        placeholder="voice speed (default 1.0)"
        value={speed}
        step="0.1"
        min="0.1"
        max="100"
        onChange={setSpeed}
      />
    </>
  )
}
