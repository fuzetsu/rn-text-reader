import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonGroup, NumberUpDown } from '../base'
import { useStore } from '../state'
import { setChunkIndex, setReading } from '../state/actions'
import { setEnabled as setDarkModeEnabled } from '../state/actions/dark-mode'

export function ReaderControls() {
  const [chunks, chunkIndex, reading, darkMode] = useStore([
    s => s.chunks,
    s => s.chunkIndex,
    s => s.reading,
    s => s.darkMode.enabled,
  ])

  if (chunks.length <= 0) return null

  const readLabel = chunks.length > 1 ? ` ${chunkIndex + 1}/${chunks.length}` : ''

  const readProps = darkMode ? { plain: true } : { primary: true }

  return (
    <>
      {chunks.length > 1 && (
        <NumberUpDown
          noField
          plain={darkMode}
          value={chunkIndex}
          step="1"
          min="0"
          max={chunks.length - 1}
          onChange={x => setChunkIndex(Number(x))}
          minusIcon="arrow-left-thick"
          plusIcon="arrow-right-thick"
          textStyle={styles.subdued}
        />
      )}
      <ButtonGroup>
        <Button
          {...readProps}
          textStyle={styles.subdued}
          icon={{ name: reading ? 'stop' : 'play' }}
          text={readLabel}
          onPress={() => setReading(!reading)}
        />
        <Button
          plain={darkMode}
          textStyle={styles.subdued}
          icon={{ name: darkMode ? 'lightbulb' : 'lightbulb-off' }}
          text={darkMode ? 'Light' : 'Dark'}
          onPress={() => setDarkModeEnabled(!darkMode)}
        />
      </ButtonGroup>
    </>
  )
}

const styles = StyleSheet.create({ subdued: { color: '#999' } })
