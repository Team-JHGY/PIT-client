import React from 'react'
import { View, StyleSheet } from 'react-native'
const Seperator = ({ height }) => {
  const getSeperatorStyle = (height) => {
    return {
      height: height,
    }
  }
  return <View style={[styles.seperator, getSeperatorStyle(height)]}></View>
}

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: '#EFF3F7',
    width: '100%',
    marginTop: 0,
  },
})

export default Seperator
