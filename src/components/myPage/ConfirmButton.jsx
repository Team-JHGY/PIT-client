import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import globalStyle from '../../utils/globalStyle'
const ConfirmButton = ({ closeModal, buttonTitle, clickEvent }) => {
  return (
    <View style={styles.button}>
      <Pressable
        onPress={async () => {
          await clickEvent()
          closeModal()
        }}
      >
        <Text style={styles.text}>{buttonTitle}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderRadius: 10,
    backgroundColor: '#2AFF91',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4.68%',
    marginBottom: '4.54%',
    marginLeft: '1.56%',
  },
  text: {
    ...globalStyle.button,
    lineHeight: 25,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#000000',
  },
})
export default ConfirmButton
