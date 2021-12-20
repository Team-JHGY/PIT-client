import React from 'react'
import { View, StyleSheet, Image, Text, Pressable } from 'react-native'
const ScheduleActionItem = ({ image, text, clickEvent }) => {
  const scheduleActionItemStyle = () => {
    if (text === '레포트') {
      return {
        width: 23,
        height: 31,
      }
    }
  }
  return (
    <Pressable
      style={styles.body}
      onPress={() => {
        clickEvent()
      }}
    >
      <Image style={[{ width: 32, height: 32 }, scheduleActionItemStyle()]} source={image} />
      <Text>{text}</Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  body: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ScheduleActionItem
