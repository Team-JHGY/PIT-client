import React, { useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import { UserContext } from '../../store/user'
import axios from 'axios'
import config from '../../utils/config'
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
          console.log(match[1], match[2])
        }
        const { code } = params
        if (code !== null && code !== undefined) {
          // 토큰 받기
          console.log('code is ' + code)
          const qs = require('query-string')
          var data = {
            grant_type: 'authorization_code',
            client_id: '3c28d92bfda00122f68ab8473b9aece5',
            redirect_uri: 'http://52.79.145.116:8080/client/white',
            code: code,
            client_secret: 'LeI9ECMDibQVxnqeSs7mxEAve69l6jA6',
          }
          axios({
            method: 'post',
            url: 'https://kauth.kakao.com/oauth/token',
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
              navigation.replace('SignUp')
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
