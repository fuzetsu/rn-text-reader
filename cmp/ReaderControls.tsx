import React from 'react'
import { Button, ButtonGroup, NumberUpDown } from '../base'
import { useStore } from '../state'
import { setChunkIndex, setLightsOff, setReading } from '../state/actions'

export function ReaderControls({ plain }: { plain?: boolean }) {
  const [chunks, chunkIndex, reading, lightsOff] = useStore([
    s => s.chunks,
    s => s.chunkIndex,
    s => s.reading,
    s => s.lightsOff,
  ])

  if (chunks.length <= 0) return null

  const chunkProgress = chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : ''
  const readLabel = (reading ? 'Stop' : 'Read') + chunkProgress

  const btnReadProps = plain ? { plain } : { primary: true }

  return (
    <>
      {chunks.length > 1 && (
        <NumberUpDown
          noField
          plain={plain}
          value={chunkIndex}
          step="1"
          min="0"
          max={chunks.length - 1}
          onChange={x => setChunkIndex(Number(x))}
          minusText="<"
          plusText=">"
        />
      )}
      <ButtonGroup>
        <Button {...btnReadProps} text={readLabel} onPress={() => setReading(!reading)} />
        <Button
          plain={plain}
          text={`Lights ${lightsOff ? 'on' : 'off'}`}
          onPress={() => setLightsOff(true)}
        />
      </ButtonGroup>
    </>
  )
}
