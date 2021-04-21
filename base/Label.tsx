import React from 'react'
import { StyleSheet, Text } from 'react-native'

export const Label = ({ text }: { text: string }) => {
  return <Text style={styles.label}>{text}</Text>
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    marginBottom: 2,
    color: '#555',
    fontSize: 14,
  },
})
