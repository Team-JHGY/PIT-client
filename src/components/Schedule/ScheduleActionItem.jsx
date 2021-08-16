import React from 'react'
import { View, StyleSheet, Image, Text, Pressable } from 'react-native'
const ScheduleActionItem = ({ image, text, clickEvent }) => {
  return (
    <Pressable
      style={styles.body}
      onPress={() => {
        clickEvent()
      }}
    >
      <Image style={{ width: 40, height: 40 }} source={image} />
      <Text>{text}</Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  body: {
    width: '31.25%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ScheduleActionItem
