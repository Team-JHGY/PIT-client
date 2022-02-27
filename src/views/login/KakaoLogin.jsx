//libraries
import React, { useState, useContext } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { WebView } from 'react-native-webview'
import axios from 'axios'

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

              return res.data.access_token
            })
            .then(async (accessToken) => {
              const res = await _axios.get(`/auth/exist?accessToken=${accessToken}&provider=KAKAO`)
              console.log(accessToken)
              if (res.data.code === 0) {
                if (res.data.data === true) {
                  return accessToken
                } else {
                  return 'user not exists'
                }
              } else {
                console.log('user/exist API 호출 실패')
                console.log(res.data)
              }
            })
            .catch((e) => {
              console.log('user/exist API Exception')
              console.log(e)
              console.log(e.response)
            })
            .then(async (accessToken) => {
              const PROVIDER = 'KAKAO'
              const ACCESSTOKEN = accessToken
              // 재로그인
              if (ACCESSTOKEN !== 'user not exists') {
                await AsyncStorage.setItem('PROVIDER', PROVIDER)
                await AsyncStorage.setItem('ACCESSTOKEN', ACCESSTOKEN)
                navigation.replace('Login')
              } else {
                // 첫 로그인
                console.log('첫 카카오 로그인')
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
