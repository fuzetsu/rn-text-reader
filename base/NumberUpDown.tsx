import React from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { TextInput } from './TextInput'
import { Button } from './Button'

interface Props {
  value: string | number
  step: string
  onChange(newValue: string): void
  min?: string | number
  max?: string | number
  placeholder?: string
  noField?: boolean
  style?: StyleProp<ViewStyle>
  minusText?: string
  plusText?: string
}

export const NumberUpDown = ({
  value,
  onChange,
  step,
  noField,
  style,
  min,
  max,
  placeholder,
  minusText = '-',
  plusText = '+',
}: Props) => {
  const format = (x: number) =>
    x.toFixed(step.includes('.') ? step.slice(step.indexOf('.') + 1).length : 0)

  const noFieldStyle = noField && styles.noField

  const numMax = Number(max)
  const numMin = Number(min)
  const numValue = Number(value)
  const numStep = Number(step)

  return (
    <View style={[styles.container, style]}>
      <Button
        text={minusText}
        textStyle={styles.buttonText}
        disabled={!isNaN(numMin) && numValue <= numMin}
        style={[styles.button, noFieldStyle]}
        onPress={() => onChange(format(numValue - numStep))}
      />
      {!noField && (
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          value={String(value)}
          onChangeText={onChange}
          placeholder={placeholder}
        />
      )}
      <Button
        text={plusText}
        disabled={!isNaN(numMax) && numValue >= numMax}
        textStyle={styles.buttonText}
        style={[styles.button, noFieldStyle]}
        onPress={() => onChange(format(numValue + numStep))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  noField: { flex: 1 },
  buttonText: { fontSize: 22 },
  button: { paddingHorizontal: 40 },
  input: { flex: 1, textAlign: 'center' },
  container: {
    margin: 2,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
})
