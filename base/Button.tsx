import React, { ComponentProps } from 'react'
import { TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle } from 'react-native'
import { Icon, IconProps } from './Icon'

interface Props extends ComponentProps<typeof TouchableOpacity> {
  text: string
  textStyle?: StyleProp<TextStyle>
  primary?: boolean
  plain?: boolean
  icon?: IconProps
}

export const Button = ({
  text,
  style,
  textStyle,
  plain,
  disabled,
  primary,
  icon,
  ...props
}: Props) => (
  <TouchableOpacity
    {...props}
    disabled={disabled}
    style={[
      styles.common,
      plain ? styles.plain : styles.default,
      disabled && styles.disabled,
      primary && styles.primary,
      style,
    ]}
  >
    <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
      {icon && (
        <>
          <Icon size={16} {...icon} />{' '}
        </>
      )}
      {text}
    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  text: { fontSize: 16, color: 'white' },
  disabled: { backgroundColor: '#333' },
  disabledText: { color: '#777' },
  common: {
    flexDirection: 'row',
    minHeight: 39,
    margin: 2,
    borderRadius: 4,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: 'rgb(70, 48, 235)' },
  plain: { borderColor: 'white', borderWidth: 1 },
  default: { backgroundColor: '#555' },
})
