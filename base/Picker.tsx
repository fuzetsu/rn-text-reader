import React, { PropsWithChildren } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker as NativePicker } from '@react-native-picker/picker'
import { PickerProps } from '@react-native-picker/picker/typings/Picker'
import { MIN_CONTROL_HEIGHT } from '../constants'

export function Picker<T>(props: PropsWithChildren<PickerProps<T>>) {
  return (
    <View style={styles.container}>
      <NativePicker {...props} style={[styles.picker, props.style]} />
    </View>
  )
}

Picker.Item = NativePicker.Item

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#777',
    overflow: 'hidden',
  },
  picker: {
    height: MIN_CONTROL_HEIGHT,
    borderWidth: 0,
  },
})
