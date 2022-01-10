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
          //console.log(match[1], match[2])
        }
        const { code } = params
        if (code !== null && code !== undefined) {
          // 토큰 받기
          //console.log('code is ' + code)
          const qs = require('query-string')
          var data = {
            grant_type: 'authorization_code',
            client_id: config.CLIENT_ID,
            redirect_uri: 'http://3.36.113.168:8080/client/white',
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
              //console.log(res.data)
              userDispatch({
                type: 'SET_MEMBER_TOKEN',
                payload: {
                  accessToken: res.data.access_token,
                  refreshToken: res.data.refresh_token,
                  expiresIn: res.data.expires_in,
                },
              })
              navigation.replace('SignUp',{provider:'KAKAO'})
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
