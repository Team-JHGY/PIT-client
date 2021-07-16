import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'

export default ButtonSmall = ({ name, onPress }) => {
  return (
    <View>
      <Pressable
        onPress={() => {
          if (onPress !== null) {
            onPress()
          }
        }}
        style={styles.button}
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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
})
