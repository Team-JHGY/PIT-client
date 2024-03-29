import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import globalStyle from '../../utils/globalStyle'
const CancelButton = ({ clickEvent, buttonTitle }) => {
  return (
    <View style={styles.button}>
      <Pressable
        onPress={() => {
          clickEvent()
        }}
      >
        <Text style={styles.text}>{buttonTitle}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 10,
    borderColor: '#FF8989',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '4.68%',
    marginBottom: '4.54%',
    marginRight: '1.56%',
  },
  text: {
    ...globalStyle.button,
    lineHeight: 25,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#DD0101',
  },
})
export default CancelButton
