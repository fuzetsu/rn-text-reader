import React, { ComponentProps, PropsWithChildren } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker as NativePicker } from '@react-native-picker/picker'

export const Picker = (props: PropsWithChildren<ComponentProps<typeof NativePicker>>) => {
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
    height: 40,
    borderWidth: 0,
  },
})
