import React, { PropsWithChildren, Children } from 'react'
import { View, StyleSheet } from 'react-native'
import { truthy } from '../lib/util'

export const ButtonGroup = ({ children }: PropsWithChildren<{}>) => (
  <View style={styles.container}>
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
