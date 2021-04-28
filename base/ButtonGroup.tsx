import React, { PropsWithChildren, Children } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { truthy } from '../lib/util'

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>

export const ButtonGroup = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>
    {Children.toArray(children)
      .filter(truthy)
      .map((child, idx) => (
        <View key={idx} style={styles.button}>
          {child}
        </View>
      ))}
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: { flex: 1 },
})
