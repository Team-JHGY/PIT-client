import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

const MainView = () => {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <Text>Main View</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: '#0F1528',
  },
})
export default MainView
