import React from 'react'
import { View, StyleSheet, Pressable, Text } from 'react-native'

//utils
import globalStyle from '../../utils/globalStyle'

const UpdateButton = ({ clickEvent }) => {
  return (
    <View style={styles.button}>
      <Pressable
        onPress={() => {
          clickEvent()
        }}
      >
        <Text style={styles.text}>{'수정'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderStyle: 'solid',
    borderRadius: 10,
    borderColor: '#C2C7CC',
    borderWidth: 2,
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
  },
})

export default UpdateButton
