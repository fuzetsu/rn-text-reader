import React, { ComponentProps } from 'react'
import { TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle } from 'react-native'

interface Props extends ComponentProps<typeof TouchableOpacity> {
  text: string
  textStyle?: StyleProp<TextStyle>
}

export const Button = ({ text, style, textStyle, disabled, ...props }: Props) => (
  <TouchableOpacity
    {...props}
    disabled={disabled}
    style={[styles.button, disabled && styles.disabled, style]}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledText, textStyle]}>{text}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  disabled: { backgroundColor: '#333' },
  disabledText: { color: '#777' },
  button: {
    height: 39,
    margin: 2,
    borderRadius: 4,
    paddingHorizontal: 15,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
