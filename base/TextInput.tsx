import React, { ComponentProps } from 'react'
import { StyleSheet, TextInput as NativeTextInput } from 'react-native'

export const TextInput = (props: ComponentProps<typeof NativeTextInput>) => {
  return <NativeTextInput {...props} style={[styles.input, props.style]} />
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#777',
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    margin: 2,
  },
})
