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

  const noFieldStyle = noField && { flex: 1 }
  const buttonMargin = noField ? 2 : 5

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
        style={[{ marginLeft: 0, marginRight: buttonMargin, paddingHorizontal: 20 }, noFieldStyle]}
        onPress={() => onChange(format(numValue - numStep))}
      />
      <TextInput
        keyboardType="number-pad"
        style={noField ? { display: 'none' } : { flex: 1 }}
        value={String(value)}
        onChangeText={onChange}
        placeholder={placeholder}
      />
      <Button
        text={plusText}
        disabled={!isNaN(numMax) && numValue >= numMax}
        textStyle={styles.buttonText}
        style={[{ marginRight: 0, marginLeft: buttonMargin, paddingHorizontal: 20 }, noFieldStyle]}
        onPress={() => onChange(format(numValue + numStep))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonText: { fontSize: 22 },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
})
