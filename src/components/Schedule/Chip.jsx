import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import globalStyle from '../../utils/globalStyle'
const Chip = ({ title, isFirst, isFocus, clickEvent, mode }) => {
  const getChipStyle = (isFirst, isFocus) => {
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
  const getUpdateChipStyle = (mode, isFocus) => {
    if (mode === 'update') {
      if (isFocus === true) {
        return {
          backgroundColor: '#00D98B',
        }
      } else {
        return {
          backgroundColor: '#F9F9F9',
          borderColor: '#E9E9E9',
        }
      }
    }
  }
  return (
    <View style={[styles.body, getChipStyle(isFirst, isFocus), getUpdateChipStyle(mode, isFocus )]}>
      <Pressable
        onPress={() => {
          if (mode === 'create'|| mode === "edit") clickEvent()
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
