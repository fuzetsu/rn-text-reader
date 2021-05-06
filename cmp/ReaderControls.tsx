import React from 'react'
import { Button, ButtonGroup, NumberUpDown } from '../base'
import { useStore } from '../state'
import { setChunkIndex, setReading } from '../state/actions'
import { setEnabled as setDarkModeEnabled } from '../state/actions/dark-mode'

export function ReaderControls({ plain }: { plain?: boolean }) {
  const [chunks, chunkIndex, reading, darkMode] = useStore([
    s => s.chunks,
    s => s.chunkIndex,
    s => s.reading,
    s => s.darkMode.enabled,
  ])

  if (chunks.length <= 0) return null

  const readLabel = chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : ''

  const readProps = plain ? { plain } : { primary: true }

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
          minusIcon="arrow-left-thick"
          plusIcon="arrow-right-thick"
        />
      )}
      <ButtonGroup>
        <Button
          {...readProps}
          icon={{ name: reading ? 'stop' : 'play' }}
          text={readLabel}
          onPress={() => setReading(!reading)}
        />
        <Button
          plain={plain}
          icon={{ name: darkMode ? 'lightbulb' : 'lightbulb-off' }}
          text={darkMode ? 'Light' : 'Dark'}
          onPress={() => setDarkModeEnabled(!darkMode)}
        />
      </ButtonGroup>
    </>
  )
}
