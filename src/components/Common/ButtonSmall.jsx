import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'

const ButtonSmall = ({ name, onPress, customStyle }) => {
  return (
    <View>
      <Pressable
        onPress={() => {
          if (onPress !== null) {
            onPress()
          }
        }}
        style={customStyle !== undefined ? [customStyle] : styles.button}
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
    color: '#5A5757',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
})
export default ButtonSmall
