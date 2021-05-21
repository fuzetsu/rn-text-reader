import React, { ComponentProps } from 'react'
import { TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { MIN_CONTROL_HEIGHT } from '../constants'
import { Icon, IconProps } from './Icon'

type ButtonType = 'primary' | 'plain' | 'default'
interface Props extends ComponentProps<typeof TouchableOpacity> {
  text: string
  textStyle?: StyleProp<TextStyle>
  icon?: IconProps | IconProps['name']
  type?: ButtonType
}

const colorMap: { [key in ButtonType]: { bg?: string; fg?: string; bc?: string; bw?: number } } = {
  primary: { bg: 'rgb(70, 48, 235)', fg: 'white' },
  default: { bg: '#333', fg: 'white' },
  plain: { fg: 'white', bc: '#eee', bw: StyleSheet.hairlineWidth },
}

export const Button = (props: Props) => {
  const { text, style, textStyle, disabled, icon, type = 'default' } = props

  const colors = colorMap[type]
  const typeStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.bg,
    borderWidth: colors.bw,
    borderColor: colors.bc,
  }

  const iconProps = typeof icon === 'string' ? { name: icon } : icon
  const buttonStyle = [styles.common, typeStyle, disabled && styles.disabled, style]

  return (
    <TouchableOpacity {...props} style={buttonStyle}>
      <Text style={[styles.text, { color: colors.fg }, disabled && styles.disabledText, textStyle]}>
        {icon && <Icon size={16} {...iconProps} />}
        {icon && text ? ' ' : ''}
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: { fontSize: 16, color: 'white' },
  disabled: { backgroundColor: '#333' },
  disabledText: { color: '#777' },
  common: {
    flexDirection: 'row',
    minHeight: MIN_CONTROL_HEIGHT,
    margin: 2,
    borderRadius: 4,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
