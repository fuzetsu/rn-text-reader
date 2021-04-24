import React, { ComponentProps } from 'react'
import { TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle } from 'react-native'

interface Props extends ComponentProps<typeof TouchableOpacity> {
  text: string
  textStyle?: StyleProp<TextStyle>
  primary?: boolean
}

export const Button = ({ text, style, textStyle, disabled, primary, ...props }: Props) => (
  <TouchableOpacity
    {...props}
    disabled={disabled}
    style={[styles.button, disabled && styles.disabled, primary && styles.primary, style]}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledText, textStyle]}>{text}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  primary: {
    backgroundColor: 'rgb(70, 48, 235)',
  },
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
