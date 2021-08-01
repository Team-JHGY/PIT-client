import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, AsyncStorage } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import * as SplashScreen from 'expo-splash-screen'

//components
import ViewHeader from '../../components/Schedule/ViewHeader'
import Seperator from '../../components/Schedule/Seperator'
import ViewBody from '../../components/Schedule/ViewBody'
export default function Schedule({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  const [appBarArray, setAppBarArray] = React.useState([])
  React.useEffect(() => {
    AsyncStorage.getItem('userAuth', (err, result) => {
      //user_id에 담긴 아이디 불러오기
      console.log(result) // result에 담김 //불러온거 출력
    })
  }, [])

  return (
    <SafeAreaView style={styles.mainForm} onLayout={onLayoutRootView}>
      <ViewHeader navigation={navigation} />
      <Seperator />
      <ViewBody navigation={navigation} />
      {/* <Text style={styles.disableText}>스케줄</Text>
        <Pressable onPress={() => navigation.navigate('NewMembers')}>
          <Text>스케줄</Text>
        </Pressable> */}
    </SafeAreaView>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainForm: {
    backgroundColor: '#ffff',
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  disableText: {
    ...globalStyle.body2,
    opacity: 0.3,
  },
})
