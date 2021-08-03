import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import globalStyle from '../../utils/globalStyle'
const CancelButton = ({ clickEvent }) => {
  return (
    <Pressable
      onPress={() => {
        clickEvent()
      }}
    >
      <View style={styles.button}>
        <Text style={styles.text}>{'취소'}</Text>
      </View>
    </Pressable>
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
    marginBottom: 20,
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
