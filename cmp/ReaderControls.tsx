import React from 'react'
import { Button, ButtonGroup } from '../base'
import { useStore } from '../state'
import { setLightsOff, setReading } from '../state/actions'

export function ReaderControls() {
  const [chunks, chunkIndex, reading] = useStore([s => s.chunks, s => s.chunkIndex, s => s.reading])

  if (chunks.length <= 0) return null

  const readBtnLabel =
    (reading ? 'Stop' : 'Read') + (chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : '')

  return (
    <ButtonGroup>
      <Button primary text={readBtnLabel} onPress={() => setReading(!reading)} />
      {reading && <Button text="Lights off" onPress={() => setLightsOff(true)} />}
    </ButtonGroup>
  )
}
