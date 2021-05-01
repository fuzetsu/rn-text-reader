import React, { ComponentProps } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { TextInput } from './TextInput'
import { Button } from './Button'

type IconNames = ComponentProps<typeof Button>['icon']['name']

interface Props {
  value: string | number
  step: string
  onChange(newValue: string): void
  min?: string | number
  max?: string | number
  placeholder?: string
  noField?: boolean
  style?: StyleProp<ViewStyle>
  minusIcon?: IconNames
  plusIcon?: IconNames
  plain?: boolean
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
  plain,
  minusIcon = 'minus',
  plusIcon = 'plus',
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
        plain={plain}
        text=""
        icon={{ name: minusIcon, size: 22 }}
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
        plain={plain}
        text=""
        icon={{ name: plusIcon, size: 22 }}
        disabled={!isNaN(numMax) && numValue >= numMax}
        style={[styles.button, noFieldStyle]}
        onPress={() => onChange(format(numValue + numStep))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  noField: { flex: 1 },
  button: { paddingHorizontal: 40 },
  input: { flex: 1, textAlign: 'center' },
  container: {
    margin: 2,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
})
