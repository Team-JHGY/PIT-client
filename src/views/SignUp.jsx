import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

const SignUpView = () => {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <Text>SignUp View</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#0F1528',
  },
})
export default SignUpView
