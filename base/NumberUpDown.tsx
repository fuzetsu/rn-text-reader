import React from 'react'
import { StyleSheet, View, StyleProp } from 'react-native'
import { TextInput } from './TextInput'
import { Button } from './Button'

interface Props {
  value: string | number
  min: string | number
  max: string | number
  step: string
  onChange(newValue: string): void
  placeholder?: string
  noField?: boolean
  style?: StyleProp<any>
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
        text="-"
        textStyle={styles.buttonText}
        disabled={!isNaN(numMin) && numValue <= numMin}
        style={[{ marginLeft: 0, marginRight: buttonMargin, paddingHorizontal: 20 }, noFieldStyle]}
        onPress={() => onChange(format(numValue - numStep))}
      />
      <View style={noField ? { display: 'none' } : { flex: 1 }}>
        <TextInput
          keyboardType="number-pad"
          value={String(value)}
          onChangeText={onChange}
          placeholder={placeholder}
        />
      </View>
      <Button
        text="+"
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
