import React, { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MainView from './src/views/Main'
import SignUpView from './src/views/SignUp'
const Stack = createStackNavigator()
var initialView = ''
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false)

  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('JWT').then((value) => {
        if (value != null) {
          initialView = 'Login'
        } else {
          initialView = 'SignUp'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync()
        // Make any API calls you need to do here
        await getJWT()

        await Font.loadAsync({
          // Load a font `NotoSansKR` from a static resource
          NotoSansKRBold: require('./assets/fonts/NotoSansKR-Bold.otf'),
          NotoSansKRMedium: require('./assets/fonts/NotoSansKR-Medium.otf'),
          NotoSansKRRegular: require('./assets/fonts/NotoSansKR-Regular.otf'),
        })
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  if (!appIsReady) {
    return null
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialView}>
        <Stack.Screen
          name="SignUp"
          component={SignUpView}
          options={{ header: () => null }}
        ></Stack.Screen>
        <Stack.Screen
          name="Main"
          component={MainView}
          options={{ header: () => null }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
