import React, { useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import { UserContext } from '../../store/user'
import axios from 'axios'
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
          console.log(match[1], match[2])
        }
        const { code } = params
        if (code !== null && code !== undefined) {
          // 토큰 받기
          console.log('code is ' + code)
          const qs = require('query-string')
          var data = {
            grant_type: 'authorization_code',
            client_id: config.NAVER_CLIENT_ID,
            code: code,
            client_secret: config.NAVER_CLIENT_SECRET_ID,
            state: config.NAVER_CLIENT_STATE_STRING
          }
          axios({
            method: 'post',
            url: config.NAVER_OAUTH_URL + '/token',
            data: qs.stringify(data),
            config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          })
            .then((res) => {
              console.log(res.data)
              userDispatch({
                type: 'SET_MEMBER_TOKEN',
                payload: {
                  accessToken: res.data.access_token,
                  refreshToken: res.data.refresh_token,
                  expiresIn: res.data.expires_in,
                },
              })
              navigation.replace('SignUp',{provider:'NAVER'})
            })
            .catch((e) => {
              console.log(e)
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
