import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import globalStyle from '../utils/globalStyle'
import * as Font from 'expo-font'

import Pitlogo from '../../assets/img/Login/PIT_logo.svg'
import KakaoLogin from '../../assets/img/Login/Kakao_login.svg'
import NaverLogin from '../../assets/img/Login/Naver_login.svg'
import { WithLocalSvg, Svg } from 'react-native-svg'
const LoginView = () => {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <WithLocalSvg style={styles.logo} asset={Pitlogo}></WithLocalSvg>
      <Text style={styles.text1}>트레이너와 회원이 함께 하는</Text>
      <Text style={styles.text2}>1:1 PT 관리</Text>
      <Text style={styles.text3}>1:1 PT 관리</Text>

      <Pressable style={styles.svgWrapper}>
        <WithLocalSvg asset={KakaoLogin} width={'100%'} height={70}></WithLocalSvg>
      </Pressable>
      <Pressable style={styles.svgWrapper}>
        <WithLocalSvg
          style={styles.loginButton}
          asset={NaverLogin}
          width={'100%'}
          height={70}
        ></WithLocalSvg>
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  svgWrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#0F1528',
    alignItems: 'center',
  },
  logo: {
    marginTop: 172,
  },
  text1: {
    ...globalStyle.body1,
    marginTop: 35,
    color: 'white',
  },
  text2: {
    ...globalStyle.body1,
    color: 'white',
  },
  loginButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
})
export default LoginView
