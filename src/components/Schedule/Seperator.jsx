import React from 'react'
import { View, StyleSheet } from 'react-native'
const Seperator = () => {
  return <View style={styles.seperator}></View>
}

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: '#EFF3F7',
    height: '2%',
    width: '100%',
    marginTop: 0,
  },
})

export default Seperator
