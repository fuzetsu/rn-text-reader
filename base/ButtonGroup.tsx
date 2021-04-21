import React, { PropsWithChildren, ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { truthy } from '../util'

type Props = PropsWithChildren<{}>

export const ButtonGroup = ({ children }: Props) => (
  <View style={styles.container}>
    {[]
      .concat(children)
      .filter<ReactNode>(truthy)
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
