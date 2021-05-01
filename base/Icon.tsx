import React, { ComponentProps } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export type IconProps = ComponentProps<typeof MaterialCommunityIcons>

export const Icon = (props: IconProps) => <MaterialCommunityIcons size={16} {...props} />
