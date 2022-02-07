import React, { useState, useContext } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { WebView } from 'react-native-webview'
import { UserContext } from '../../store/user'
import axios from 'axios'
import { _axios } from '../../utils/config'
import config from '../../utils/config'
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
            })
            .catch((e) => {
              console.log(e)
            })
            .finally(async () => {
              const PROVIDER = await AsyncStorage.getItem('PROVIDER')
              const ACCESSTOKEN = await AsyncStorage.getItem('ACCESSTOKEN')
              // 재로그인
              if (PROVIDER !== undefined && ACCESSTOKEN !== undefined) {
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
                }
              } else {
                // 첫 로그인
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

export async function RefreshToken(token) {
  const url = config.NAVER_OAUTH_URL + '/token'

  var data = {
    grant_type: 'refresh_token',
    client_id: config.NAVER_CLIENT_ID,
    client_secret: config.NAVER_CLIENT_SECRET_ID,
    refresh_token: token,
  }
  await axios({
    method: 'post',
    url: config.NAVER_OAUTH_URL + '/token',
    data: qs.stringify(data),
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  })
    .then((res) => {
      return new Promise((resolve, reject) => {
        if (res.data.access_token !== undefined) {
          userDispatch({
            type: 'SET_MEMBER_TOKEN_WITHOUT_REFRESH',
            payload: {
              accessToken: res.data.access_token,
              expiresIn: res.data.expires_in,
            },
          })
          resolve('SignIn')
        } else {
          console.log(res.data.error)
          console.log(res.data.error_description)
          reject('Login')
        }
      })
    })
    .then(async (res) => {
      let payload = {
        provider: 'NAVER',
        accessToken: userState.accessToken,
        refreshToken: userState.refreshToken,
      }
      await _axios
        .patch(config.BASE_URL + '/auth/oauth-token', payload, {
          headers: {
            Authorization: userState.jwtToken,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.data.code !== 0) {
            console.log('API 서버 유저 토큰 갱신 실패')
          }
        })
      return res
    })
    .catch((res) => {
      return res
    })
}
