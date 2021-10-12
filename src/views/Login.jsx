import React, { useCallback, useContext } from 'react'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import globalStyle from '../utils/globalStyle'
import { _axios } from '../utils/http-utils'
import Pitlogo from '../../assets/img/Login/PIT_logo.svg'
import KakaoLogin from '../../assets/img/Login/Kakao_login.png'
import NaverLogin from '../../assets/img/Login/Naver_login.png'
import { WithLocalSvg } from 'react-native-svg'

// context
import { UserContext } from '../store/user'

export default function LoginView({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  const { userState, userDispatch } = useContext(UserContext)
  const fakeLogin = (accessToken, role) => {
    _axios
      .post('/auth/fake-signin', JSON.stringify({ accessToken: accessToken, provider: 'KAKAO' }))
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          userDispatch({
            type: 'SET_JWT_TOKEN',
            payload: { jwtToken: res.data.data.token },
          })
          userDispatch({
            type: 'SET_ROLE',
            payload: { role: role },
          })
          navigation.navigate('Home')
        }
      })
  }
  return (
    <View style={styles.body} onLayout={onLayoutRootView}>
      <WithLocalSvg style={styles.logo} asset={Pitlogo}></WithLocalSvg>
      <Text style={styles.text1}>트레이너와 회원이 함께 하는</Text>
      <Text style={styles.text2}>1:1 PT 관리</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Pressable onPress={() => fakeLogin('dummytoken11', 'trainer')}>
            <View style={styles.testAccount}>
              <Text>트레이너 계정 1</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken12', 'trainer')}>
            <View style={styles.testAccount}>
              <Text>트레이너 계정 2</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken13', 'trainer')}>
            <View style={styles.testAccount}>
              <Text>트레이너 계정 3</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken14', 'trainer')}>
            <View style={styles.testAccount}>
              <Text>트레이너 계정 4</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken15', 'trainer')}>
            <View style={styles.testAccount}>
              <Text>트레이너 계정 5</Text>
            </View>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Pressable onPress={() => fakeLogin('dummytoken21', 'member')}>
            <View style={styles.testAccount}>
              <Text>회원 계정 1</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken22', 'member')}>
            <View style={styles.testAccount}>
              <Text>회원 계정 2</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken23', 'member')}>
            <View style={styles.testAccount}>
              <Text>회원 계정 3</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken24', 'member')}>
            <View style={styles.testAccount}>
              <Text>회원 계정 4</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => fakeLogin('dummytoken25', 'member')}>
            <View style={styles.testAccount}>
              <Text>회원 계정 5</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <Pressable></Pressable>
      <Pressable
        style={[styles.svgWrapper, { marginTop: 60 }]}
        onPress={() => {
          navigation.navigate('KakaoLogin')
        }}
      >
        <Image source={KakaoLogin} style={{ width: 400, height: 70 }} />
      </Pressable>
      <Pressable
        style={styles.svgWrapper}
        onPress={() => {
          navigation.navigate('NaverLogin')
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
