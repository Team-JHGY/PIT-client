import React, { useCallback } from 'react'
import { StyleSheet, Text, SafeAreaView } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

export default function MainView() {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <SafeAreaView style={styles.body} onLayout={onLayoutRootView}>
      <Text>Main View</Text>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
