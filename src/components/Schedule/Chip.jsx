import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import globalStyle from '../../utils/globalStyle'
const Chip = ({ title, isFirst, isFocus, clickEvent }) => {
  const chipStyle = (isFirst, isFocus) => {
    if (isFirst === false && isFocus === false)
      return {
        marginLeft: '2.22%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#C2C7CC',
      }
    else if (isFirst === true && isFocus === false) {
      return {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#C2C7CC',
      }
    } else if (isFirst === false && isFocus === true) {
      return {
        marginLeft: '2.22%',
        backgroundColor: '#2AFF91',
      }
    } else if (isFirst === true && isFocus === true) {
      return {
        backgroundColor: '#2AFF91',
      }
    }
  }
  return (
    <View style={[styles.body, chipStyle(isFirst, isFocus)]}>
      <Pressable
        onPress={() => {
          clickEvent()
        }}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    borderRadius: 100,
    width: '18.3%',
    height: '100%',
  },
  text: {
    ...globalStyle.body2,
    textAlign: 'center',
  },
})
export default Chip
