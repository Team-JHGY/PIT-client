import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview'

export default KakaoLogin = ({ navigation }) => {
  const [url, setUrl] = useState(
    'https://kauth.kakao.com/oauth/authorize?client_id=3c28d92bfda00122f68ab8473b9aece5&response_type=code&redirect_uri=http://localhost:8080/client/kakao'
  )
  const _onNavigationStateChange = (webViewState) => {
    console.log(webViewState.url)
  }

  const onNavigationStateChange = (navState) => {
    if (url !== navState.url) {
      //   url = navState.url
      //   alert(url)
      //   this.setState({
      //     url: url,
      //   })
      setUrl(navState.url)
      console.log(navState.url)
      //   navigation.navigate('Home')
    }
  }
  return (
    <WebView
      style={{ marginTop: 20 }}
      source={{
        // uri: 'https://kauth.kakao.com/oauth/authorize?client_id=3c28d92bfda00122f68ab8473b9aece5&response_type=code&redirect_uri=http://localhost:8080/client/kakao',
        uri: url,
      }}
      onNavigationStateChange={
        // _onNavigationStateChange.bind(this)
        onNavigationStateChange
        // console.log('??')
      }
      renderLoading={() => {
        navigation.navigate('Home')
      }}
      renderError={() => {
        //navigation.navigate('Home')
      }}
    ></WebView>
  )
}
