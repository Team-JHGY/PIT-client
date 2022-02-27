// libraries
import React, { useState, useContext } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { WebView } from 'react-native-webview'
import axios from 'axios'

// utils
import { _axios } from '../../utils/http-utils'
import config from '../../utils/config'

// store
import { UserContext } from '../../store/user'
export default NaverLogin = ({ navigation }) => {
  var i = 0
  const { userState, userDispatch } = useContext(UserContext)
  const [url, setUrl] = useState(
    config.NAVER_OAUTH_URL +
      '/authorize?response_type=code&client_id=' +
      config.NAVER_CLIENT_ID +
      '&redirect_uri=' +
      config.BASE_URL +
      '/client/white&state=' +
      config.NAVER_CLIENT_STATE_STRING
  )
  const onNavigationStateChange = (navState) => {
    if (url !== navState.url) {
      if (i == 0) {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match
        while ((match = regex.exec(navState.url))) {
          params[match[1]] = match[2]
        }
        const { code } = params
        if (code !== null && code !== undefined) {
          // 토큰 받기
          const qs = require('query-string')
          var data = {
            grant_type: 'authorization_code',
            client_id: config.NAVER_CLIENT_ID,
            code: code,
            client_secret: config.NAVER_CLIENT_SECRET_ID,
            state: config.NAVER_CLIENT_STATE_STRING,
          }
          axios({
            method: 'post',
            url: config.NAVER_OAUTH_URL + '/token',
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
              const res = await _axios.get(`/auth/exist?accessToken=${accessToken}&provider=NAVER`)
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
              console.log(e)
            })
            .then(async (accessToken) => {
              const PROVIDER = 'NAVER'
              const ACCESSTOKEN = accessToken
              // 재로그인
              if (ACCESSTOKEN !== 'user not exists') {
                await AsyncStorage.setItem('PROVIDER', PROVIDER)
                await AsyncStorage.setItem('ACCESSTOKEN', ACCESSTOKEN)
                navigation.replace('Login')
              } else {
                // 첫 로그인
                console.log('첫 네이버 로그인')
                navigation.replace('SignUp', { provider: 'NAVER' })
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
  const url = config.NAVER_OAUTH_URL + '/token'
  var data = {
    grant_type: 'refresh_token',
    client_id: config.NAVER_CLIENT_ID,
    client_secret: config.NAVER_CLIENT_SECRET_ID,
    refresh_token: token,
  }
  const qs = require('query-string')

  await axios({
    method: 'post',
    url: config.NAVER_OAUTH_URL + '/token',
    data: qs.stringify(data),
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  })
    .then((res) => {
      if (res.data.access_token !== undefined) {
        functionReturn = {
          type: 'SET_MEMBER_TOKEN_WITHOUT_REFRESH',
          payload: {
            accessToken: res.data.access_token,
            expiresIn: res.data.expires_in,
          },
        }

        // resolve('SignIn')
      } else {
        console.log(res.data.error)
        console.log(res.data.error_description)
        functionReturn = 'Login'
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
    provider: 'NAVER',
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
      console.log(e.response.data.code)
      functionRes = 'Login'
    })
  return functionRes
}
