//libraries
import React, { useCallback, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Image, AsyncStorage } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import axios from 'axios'
import { decode } from 'js-base64'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../utils/globalStyle'
import { _axios } from '../utils/http-utils'
import config from '../utils/config'

// assets
import Pitlogo from '../../assets/img/Login/PIT_logo.svg'
import KakaoLogin from '../../assets/img/Login/Kakao_login.png'
import NaverLogin from '../../assets/img/Login/Naver_login.png'
import {
  TEST_TRAINER1_PROFILE,
  TEST_TRAINER2_PROFILE,
  TEST_MEMBER1_PROFILE,
} from '../utils/constant'

// context
import { UserContext } from '../store/user'

import { refreshToken as kakaoRefreshToken } from './login/KakaoLogin'
import { updateToken as kakaoUpdateToken } from './login/KakaoLogin'
import { updateToken as naverUpdateToken } from './login/NaverLogin'
import { refreshToken as naverRefreshToken } from './login/NaverLogin'
import { initializeUserInfo } from '../api/Auth/commonFunctions'

export default function LoginView({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  const { userState, userDispatch } = useContext(UserContext)
  /*const fakeLogin = (accessToken, role, name, profile) => {
    _axios
      .post('/auth/fake-signin', JSON.stringify({ accessToken: accessToken, provider: 'KAKAO' }))
      .then((res) => {
        if (res.status === 200) {
          userDispatch({
            type: 'SET_JWT_TOKEN',
            payload: { jwtToken: res.data.data.token },
          })
          userDispatch({
            type: 'SET_ROLE',
            payload: { role: role },
          })
          userDispatch({
            type: 'SET_MEMBER_NAME',
            payload: { name: name },
          })
          if (profile !== undefined) {
            userDispatch({
              type: 'SET_PROFILE',
              payload: { profile: profile },
            })
          }
          navigation.navigate('Home')
        }
      })
  }*/
  const loginProcess = async () => {
    const PROVIDER = await AsyncStorage.getItem('PROVIDER')
    const ACCESSTOKEN = await AsyncStorage.getItem('ACCESSTOKEN')

    console.log('provider is ' + PROVIDER)
    console.log('accesstoken is ' + ACCESSTOKEN)
    if (PROVIDER !== null && ACCESSTOKEN !== null) {
      let payload = {
        accessToken: ACCESSTOKEN,
        provider: PROVIDER,
      }
      try {
        const res = await _axios.post('/auth/signin', payload)
        if (res.data.code === 0) {
          console.log('정상 로그인')
          const param = {
            userDispatch: userDispatch,
            jwtToken: res.data.data.token,
          }
          await initializeUserInfo(param)
          navigation.replace('Home')
        } else {
          console.log('Sign In API 호출 실패')
        }
      } catch (e) {
        console.log(e.response.data)
        if (e.response.data.code === -14) {
          console.log('토큰 만료 Refresh 진행 시작')
          const refreshToken = e.response.data.data
          let res
          let updateRes
          if (PROVIDER === 'KAKAO') {
            res = await kakaoRefreshToken(refreshToken)
            if (res === 'KOE322') {
              updateRes = 'Login'
            } else {
              userDispatch(res)
              res.payload.refreshToken =
                res.payload.refreshToken === undefined ? refreshToken : res.payload.refreshToken
              updateRes = await kakaoUpdateToken(res)
              await AsyncStorage.setItem('ACCESSTOKEN', res.payload.accessToken)
            }
          } else {
            console.log('naver 리프레시토큰 시작')
            res = await naverRefreshToken(refreshToken)
            if (res === 'Login') {
              updateRes = 'Login'
            } else {
              userDispatch(res)
              res.payload.refreshToken = refreshToken
              updateRes = await naverUpdateToken(res)
              await AsyncStorage.setItem('ACCESSTOKEN', res.payload.accessToken)
            }
          }
          if (updateRes === 'SignIn') {
            console.log('signin')
            await loginProcess()
          } else {
            console.log(updateRes + '페이지에 stay')
          }
        } else {
          console.log('Sign In API 호출 실패2')
        }
      }
    } else {
      // 로그인 페이지에 stay
      console.log('회원가입 필요 상태')
    }
  }
  useEffect(() => {
    async function login() {
      await loginProcess()
    }
    login()
    //AsyncStorage.clear()

    //AsyncStorage.setItem('PROVIDER', 'KAKAO')
    //AsyncStorage.setItem('ACCESSTOKEN', '-hfLUDek2uiM2irVQMHS-rZbkxoGj1pHPf6YMwo9dNsAAAF_HEsqNA')
    //AsyncStorage.setItem('PROVIDER', 'KAKAO')
    //AsyncStorage.setItem('ACCESSTOKEN', 'VmOVdg678M4b47nrT1CIZIf4C0Es2Aye88ADjworDNQAAAF_EW4SDw')
  }, [])
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <WithLocalSvg style={styles.logo} asset={Pitlogo}></WithLocalSvg>
      <Text style={styles.text1}>트레이너와 회원이 함께 하는</Text>
      <Text style={styles.text2}>1:1 PT 관리</Text>
      {/*
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Pressable
              onPress={() =>
                fakeLogin('dummytoken11', 'TRAINER', '트레이너 계정1', TEST_TRAINER1_PROFILE)
              }
            >
              <View style={styles.testAccount}>
                <Text>트레이너 계정 1</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() =>
                fakeLogin('dummytoken12', 'TRAINER', '트레이너 계정2', TEST_TRAINER2_PROFILE)
              }
            >
              <View style={styles.testAccount}>
                <Text>트레이너 계정 2</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken13', 'TRAINER', '트레이너 계정3', '')}>
              <View style={styles.testAccount}>
                <Text>트레이너 계정 3</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken14', 'TRAINER', '트레이너 계정4')}>
              <View style={styles.testAccount}>
                <Text>트레이너 계정 4</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken15', 'TRAINER', '트레이너 계정5')}>
              <View style={styles.testAccount}>
                <Text>트레이너 계정 5</Text>
              </View>
            </Pressable>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Pressable
              onPress={() => fakeLogin('dummytoken21', 'MEMBER', '회원계정1', TEST_MEMBER1_PROFILE)}
            >
              <View style={styles.testAccount}>
                <Text>회원 계정 1</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken22', 'MEMBER', '회원계정2')}>
              <View style={styles.testAccount}>
                <Text>회원 계정 2</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken23', 'MEMBER', '회원계정3')}>
              <View style={styles.testAccount}>
                <Text>회원 계정 3</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken24', 'MEMBER', '회원계정4')}>
              <View style={styles.testAccount}>
                <Text>회원 계정 4</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => fakeLogin('dummytoken25', 'MEMBER', '회원계정5')}>
              <View style={styles.testAccount}>
                <Text>회원 계정 5</Text>
              </View>
            </Pressable>
          </View>
        </View>
            */}
      <Pressable
        style={[styles.svgWrapper, { marginTop: 60 }]}
        onPress={() => {
          navigation.replace('KakaoLogin')
        }}
      >
        <Image source={KakaoLogin} style={{ width: 400, height: 70 }} />
      </Pressable>
      <Pressable
        style={styles.svgWrapper}
        onPress={() => {
          navigation.replace('NaverLogin')
        }}
      >
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
  testAccount: {
    backgroundColor: 'orange',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
})
