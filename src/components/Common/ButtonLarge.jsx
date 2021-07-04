import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import globalStyle from '../../utils/globalStyle'
export default ButtonLarge = ({ name, isEnable, onPress }) => {
  return (
    <Pressable
      style={isEnable === true ? styles.enable : disableStyle}
      disabled={isEnable === true ? false : true}
      onPress={() => {
        onPress()
      }}
      android_ripple={{ color: '#2AAAAA' }}
    >
      <Text style={styles.text}>{name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  text: { ...globalStyle.button },
  enable: {
    backgroundColor: '#2AFF91',
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 30,
    alignSelf: 'stretch',
    position: 'relative',
  },
  disable: {
    opacity: 0.5,
  },
})
var disableStyle = StyleSheet.compose(styles.enable, styles.disable)
