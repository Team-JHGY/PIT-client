import React, { useEffect, useState, useContext } from 'react'
import { Text, StyleSheet, View, Pressable, Image } from 'react-native'
import TextField from '../../components/Common/TextField'
import { Appbar } from 'react-native-paper'

// context
import { UserContext } from '../../store/user'
import { initializeUserInfo } from '../../api/Auth/commonFunctions'

// components
import ButtonLarge from '../../components/Common/ButtonLarge'

// utils
import globalStyle from '../../utils/globalStyle'

// assets
import arrow_left from '../../../assets/arrow_left.png'
import config from '../../utils/config'

export default function NormalLogin({ navigation }) {
  const [buttonEnable, setButtonEnable] = useState('false')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  const { userState, userDispatch } = useContext(UserContext)

  useEffect(() => {
    if (id !== '' && password !== '') setButtonEnable(true)
  }, [id, password])

  async function normalLoginProcess() {
    let payload = {
      email: id,
      password: password,
    }
    try {
      const dataRes = await fetch(`${config.BASE_URL}/auth/signin`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const dataResJson = await dataRes.json()
      if (dataResJson.code === 0) {
        const param = {
          userDispatch: userDispatch,
          jwtToken: dataResJson.data.token,
        }
        await initializeUserInfo(param)
        navigation.replace('Home')
      } else {
        console.log('NormalLogin 호출 실패')
      }
    } catch (e) {
      console.log(e.response.data)
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Pressable
          style={globalStyle.iconSize}
          onPress={() => {
            navigation.replace('Login')
          }}
        >
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content title={'로그인하기'} titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <View style={styles.body}>
        <View style={[globalStyle.textField, { marginTop: 5 }]}>
          <TextField
            title={'아이디'}
            input={id}
            height={55}
            isMandatory={true}
            setInput={(input) => {
              setId(input)
            }}
          />
        </View>
        <View style={[globalStyle.textField, { marginTop: 10 }]}>
          <TextField
            title={'비밀번호'}
            input={password}
            height={55}
            isMandatory={true}
            setInput={(input) => {
              setPassword(input)
            }}
            isPassword={true}
          />
        </View>

        <ButtonLarge
          name={'로그인'}
          isEnable={buttonEnable}
          onPress={async () => {
            await normalLoginProcess()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center' },
  cardWrapper: {
    marginTop: 60,
    flexDirection: 'row',
    height: 300,
    width: '88.8%',
  },
  titleAppbar: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
    flex: 1,
  },
  appbarTitle: {
    ...globalStyle.header,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    marginBottom: 0,
  },
  heading: { ...globalStyle.heading1 },
  body2: { ...globalStyle.body2 },
  description: {
    width: '88.8%',
    marginTop: 25,
  },
  text: {
    ...globalStyle.body2,
    fontSize: 15,
    lineHeight: 20,
    color: '#5A5757',
  },
})
