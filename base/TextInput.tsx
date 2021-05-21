import React, { ComponentProps } from 'react'
import { StyleSheet, TextInput as NativeTextInput } from 'react-native'
import { MIN_CONTROL_HEIGHT } from '../constants'

export const TextInput = (props: ComponentProps<typeof NativeTextInput>) => {
  return <NativeTextInput {...props} style={[styles.input, props.style]} />
}

const styles = StyleSheet.create({
  input: {
    height: MIN_CONTROL_HEIGHT,
    borderColor: '#777',
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    margin: 2,
  },
})
