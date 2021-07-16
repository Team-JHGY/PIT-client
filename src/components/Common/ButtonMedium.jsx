import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import globalStyle from '../../utils/globalStyle'
export default ButtonMedium = ({ name, onPress, width, height, isSelected }) => {
  const buttonMediumStyle = (width, height) => {
    if (isSelected === true) {
      return {
        width: width,
        height: height,
        backgroundColor: '#2AFF91',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }
    } else {
      return {
        width: width,
        height: height,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#C2C7CC',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  }

  return (
    <View>
      <Pressable
        onPress={() => {
          if (onPress !== null) {
            onPress()
          }
        }}
        style={buttonMediumStyle(width, height, isSelected)}
      >
        <Text style={styles.text}>{name}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C2C7CC',
    borderRadius: 6,
  },
  text: {
    color: '#000000',
    ...globalStyle.body2,
  },
})
