import React from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'

export default ButtonSmallRed = ({ name, onPress }) => {
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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
})
