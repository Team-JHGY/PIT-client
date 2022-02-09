//libraries
import React, { useState, useContext } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { WebView } from 'react-native-webview'
import axios from 'axios'
import { decode } from 'js-base64'

// utils
import config from '../../utils/config'
import { _axios } from '../../utils/http-utils'

// store
import { UserContext } from '../../store/user'

export default KakaoLogin = ({ navigation }) => {
  var i = 0
  const { userState, userDispatch } = useContext(UserContext)
  const [url, setUrl] = useState(
    config.KAKAO_OAUTH_URL +
      '/oauth/authorize?client_id=' +
      config.CLIENT_ID +
      '&response_type=code&redirect_uri=' +
      config.BASE_URL +
      '/client/white'
  )
  const onNavigationStateChange = (navState) => {
    if (url !== navState.url) {
      if (i == 0) {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match
        while ((match = regex.exec(navState.url))) {
          params[match[1]] = match[2]
          //console.log(match[1], match[2])
        }
        const { code } = params
        if (code !== null && code !== undefined) {
          // 토큰 받기
          const qs = require('query-string')
          var data = {
            grant_type: 'authorization_code',
            client_id: config.CLIENT_ID,
            redirect_uri: config.BASE_URL + '/client/white',
            code: code,
            client_secret: config.KAKAO_CLIENT_SECRET_ID,
          }

          axios({
            method: 'post',
            url: 'https://kauth.kakao.com/oauth/token',
            data: qs.stringify(data),
            config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          })
            .then((res) => {
              userDispatch({
                type: 'SET_MEMBER_TOKEN',
                payload: {
                  accessToken: res.data.access_token,
                  refreshToken: res.data.refresh_token,
                  expiresIn: res.data.expires_in,
                },
              })
            })
            .catch((e) => {
              console.log(e)
            })
            .finally(async () => {
              const PROVIDER = await AsyncStorage.getItem('PROVIDER')
              const ACCESSTOKEN = await AsyncStorage.getItem('ACCESSTOKEN')
              // 재로그인
              if (PROVIDER !== null && ACCESSTOKEN !== null) {
                let payload = {
                  accessToken: ACCESSTOKEN,
                  provider: PROVIDER,
                }
                const res = await _axios.post('/auth/signin', payload)
                if (res.data.code === 0) {
                  console.log('정상 로그인')
                  //TODO 자기소개 부재
                  userDispatch({
                    type: 'SET_JWT_TOKEN',
                    payload: { jwtToken: res.data.data.token },
                  })

                  const userId = JSON.parse(decode(res.data.data.token.split('.')[1])).sub
                  const userDataRes = await _axios.get(`/members/${userId}`, {
                    headers: {
                      Authorization: userState.jwtToken,
                      'Content-Type': 'application/json',
                    },
                  })
                  if (userDataRes.data.code === 0) {
                    userDispatch({
                      type: 'SET_ROLE',
                      payload: { role: userDataRes.data.user.type },
                    })
                    userDispatch({
                      type: 'SET_MEMBER_GENDER',
                      payload: { gender: userDataRes.data.user.gender },
                    })
                    userDispatch({
                      type: 'SET_MEMBER_NAME',
                      payload: { name: userDataRes.data.user.name },
                    })
                    userDispatch({
                      type: 'SET_MEMBER_BIRTHDAY',
                      payload: { birthday: userDataRes.data.birthday },
                    })
                    userDispatch({
                      type: 'SET_PROFILE',
                      payload: { profile: userDataRes.data.profileImage.path },
                    })
                  }
                  navigation.replace('Home')
                } else {
                }
              } else {
                // 첫 로그인
                navigation.replace('SignUp', { provider: 'KAKAO' })
              }
            })
          i++
        }
      }
    }
  }
  return (
    <WebView
      style={{ marginTop: 20 }}
      method={'post'}
      source={{
        uri: url,
      }}
      onNavigationStateChange={onNavigationStateChange}
    ></WebView>
  )
}

export async function refreshToken(token) {
  let functionReturn
  const url = config.KAKAO_OAUTH_URL + '/oauth/token'
  const payload = {
    grant_type: 'refresh_token',
    client_id: config.CLIENT_ID,
    refresh_token: token,
    client_secret: config.KAKAO_CLIENT_SECRET_ID,
  }
  const qs = require('query-string')
  await axios({
    method: 'post',
    url: url,
    data: qs.stringify(payload),
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  })
    .then((res) => {
      if (res.data.access_token !== null) {
        if (res.data.refreshToken !== undefined) {
          // 카카오에서 아예 주지 않음
          // 엑세스 토큰, 리프레시 토큰 재발급
          console.log('엑세스 토큰 & 리프레시 토큰 재발급')
          functionReturn = {
            type: 'SET_MEMBER_TOKEN',
            payload: {
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token,
              expiresIn: res.data.expires_in,
            },
          }
        } else if (res.data.refreshToken === undefined) {
          // 엑세스 토큰 재발급
          console.log('엑세스 토큰 재발급')

          functionReturn = {
            type: 'SET_MEMBER_TOKEN_WITHOUT_REFRESH',
            payload: {
              accessToken: res.data.access_token,
              expiresIn: res.data.expires_in,
            },
          }
        }
      } else if (res.data.error_code === 'KOE322') {
        // 인가코드 재발급필요
        console.log('인가 코드 재발급필요')
        functionReturn = 'KOE322'
      }
    })
    .catch((e) => {
      console.log(e.response.data.code)
    })

  return functionReturn
}

export async function updateToken(param) {
  let functionRes
  let payload = {
    provider: 'KAKAO',
    accessToken: param.payload.accessToken,
    refreshToken: param.payload.refreshToken,
  }
  await _axios
    .patch('/auth/oauth-token', payload)
    .then((res) => {
      if (res.data.code !== 0) {
        console.log('API 서버 유저 토큰 갱신 실패')
        functionRes = 'Login'
      } else if (res.data.code === 0) {
        console.log('토큰 갱신 성공')
        functionRes = 'SignIn'
      }
    })
    .catch((e) => {
      console.log(e.response.data)
      functionRes = 'Login'
    })
  return functionRes
}
