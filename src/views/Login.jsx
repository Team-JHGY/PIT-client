import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import globalStyle from '../utils/globalStyle'

import Pitlogo from '../../assets/img/Login/PIT_logo.svg'
import KakaoLogin from '../../assets/img/Login/Kakao_login.png'
import NaverLogin from '../../assets/img/Login/Naver_login.png'
import { WithLocalSvg } from 'react-native-svg'

export default function LoginView({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <WithLocalSvg style={styles.logo} asset={Pitlogo}></WithLocalSvg>
      <Text style={styles.text1}>트레이너와 회원이 함께 하는</Text>
      <Text style={styles.text2}>1:1 PT 관리</Text>

      <Pressable
        style={[styles.svgWrapper, { marginTop: 60 }]}
        onPress={() => {
          navigation.navigate('KakaoLogin')
        }}
      >
        <Image source={KakaoLogin} style={{ width: 400, height: 70 }} />
        {/* <WithLocalSvg asset={KakaoLogin} width={'88.8%'} height={70}></WithLocalSvg> */}
      </Pressable>
      <Pressable
        style={styles.svgWrapper}
        onPress={() => {
          navigation.navigate('SignUp')
        }}
      >
        {/* <WithLocalSvg
          style={{ marginTop: 20 }}
          asset={NaverLogin}
          width={'88.8%'}
          height={70}
        ></WithLocalSvg> */}
        <Image source={NaverLogin} style={{ width: 400, height: 70, marginTop: 20 }} />
      </Pressable>
      <Text style={styles.footerText}>PIT project</Text>
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
    lineHeight: 24,
    marginTop: 35,
    color: 'white',
  },
  text2: {
    ...globalStyle.body1,
    lineHeight: 24,
    color: 'white',
  },
  footerText: {
    ...globalStyle.body2,
    lineHeight: 19,
    color: '#FFFFFF',
    opacity: 0.2,
    marginTop: 'auto',
    marginBottom: 30,
  },
})
