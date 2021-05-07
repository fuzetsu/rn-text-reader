import React, { PropsWithChildren, Children } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>

export const ButtonGroup = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>
    {Children.toArray(children).map((child, idx) =>
      child ? (
        <View key={idx} style={styles.button}>
          {child}
        </View>
      ) : null
    )}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  button: { flex: 1 },
})
