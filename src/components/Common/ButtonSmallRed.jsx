import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'

const ButtonSmallRed = ({ name, onPress }) => {
  return (
    <View style={styles.buttonWrapper}>
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
    borderColor: '#FF8989',
    borderRadius: 6,
  },
  text: {
    color: '#DD0101',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
})

export default ButtonSmallRed
