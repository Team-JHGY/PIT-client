import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Button,
  Pressable,
  AsyncStorage,
} from 'react-native'
import InputScrollView from 'react-native-input-scroll-view'
import { WithLocalSvg } from 'react-native-svg'
import { Appbar } from 'react-native-paper'
import * as DocumentPicker from 'expo-document-picker'
import { decode } from 'js-base64'

import globalStyle from '../../utils/globalStyle'
import TextField from '../../components/Common/TextField'
import ButtonLarge from '../../components/Common/ButtonLarge'
import ButtonSmall from '../../components/Common/ButtonSmall'
import ButtonSmallRed from '../../components/Common/ButtonSmallRed'

//icons image
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import arrow_left from '../../../assets/arrow_left.png'
import Asterisk from '../../../assets/icon/asterisk.svg'

// context
import { UserContext } from '../../store/user'

// utils
import { _axios } from '../../utils/http-utils'
import config from '../../utils/config'
import { initializeUserInfo } from '../../api/Auth/commonFunctions'
function birthDayValidCheck(birthday) {
  let year = new Date().getFullYear()
  if (
    Number(birthday.substr(0, 4)) <= year &&
    Number(birthday.substr(4, 2)) >= 1 &&
    Number(birthday.substr(4, 2)) <= 12 &&
    Number(birthday.substr(6, 2)) >= 1 &&
    Number(birthday.substr(6, 2)) <= 31
  ) {
    return true
  } else {
    return false
  }
}
export default function SignUpStep2(props) {
  const [buttonEnable, setButtonEnable] = React.useState('false')
  const [image, setImage] = React.useState(null)
  const [formData, setFormData] = React.useState(new FormData())
  const { goBackStep, openModal, navigation, provider } = props //앞에서 전달받은 정보
  const { userState, userDispatch } = useContext(UserContext)
  const { name, gender, birthday, intro, accessToken, refreshToken, expiresIn, role } = userState

  useEffect(() => {
    AddtoLocalUserAuth()
  }, [])
  useEffect(() => {
    if (role === 'TRAINER') {
      if (name.length > 0) setButtonEnable(true)
      else setButtonEnable(false)
    } else if (role === 'MEMBER') {
      if (name.length > 0 && birthday.length == 8) setButtonEnable(true)
      else setButtonEnable(false)
    }
  }, [name, gender, birthday])

  function AddtoLocalUserAuth() {}

  const pickImage = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'image/*' })

    const imageValue = {
      uri: result.uri,
      name: result.name,
      type: `image/${result.name.slice(-5).split('.')[1]}`,
    }
    formData.append('profile', imageValue)

    setImage(result.uri)
  }
  const uploadImage = async (jwtToken) => {
    let headerValue = new Headers()
    headerValue.append('Authorization', jwtToken)
    headerValue.append('Content-Type', 'multipart/form-data')

    const userId = JSON.parse(decode(jwtToken.split('.')[1])).sub
    fetch(`${config.BASE_URL}/profile-image/${userId}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      body: formData,
      headers: headerValue,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.code)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  function ToggleButton(gender) {
    userDispatch({ type: 'SET_MEMBER_GENDER', payload: { gender: gender } })
  }

  return (
    <InputScrollView>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Pressable style={globalStyle.iconSize} onPress={() => goBackStep()}>
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content
          title={role === 'MEMBER' ? '회원으로 가입' : '트레이너로 가입'}
          titleStyle={styles.appbarTitle}
        />
        <Pressable
          style={(globalStyle.header, { marginLeft: 'auto', paddingRight: 20 })}
          onPress={() => openModal()}
        >
          <WithLocalSvg asset={closeIcon} />
        </Pressable>
      </Appbar.Header>
      <View style={styles.body}>
        {image !== null ? (
          <Image source={{ uri: image }} style={styles.profile} />
        ) : (
          <Image
            style={
              role === 'MEMBER' ? [styles.profile, { borderColor: '#11F37E' }] : styles.profile
            }
            source={require('../../../assets/img/SignUp/emptyProfile.png')}
          />
        )}
        <View style={styles.buttonWrapper}>
          <ButtonSmall
            name={'사진 업로드'}
            onPress={() => {
              pickImage()
            }}
          />
          {image !== null && (
            <View style={{ marginLeft: 10 }}>
              <ButtonSmallRed
                name={'삭제'}
                onPress={() => {
                  setImage(null)
                }}
              />
            </View>
          )}
        </View>

        <View style={[globalStyle.textField, { marginTop: 35 }]}>
          <TextField
            title={'이름'}
            name="name"
            input={name}
            height={55}
            isMandatory={true}
            setInput={(input) => {
              const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]*$/

              if (regex.test(input)) {
                userDispatch({ type: 'SET_MEMBER_NAME', payload: { name: input } })
              }
            }}
          />
        </View>
        {role === 'TRAINER' ? null : (
          <>
            <View style={globalStyle.textField}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titleText}>성별</Text>

                <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                  <WithLocalSvg asset={Asterisk}></WithLocalSvg>
                </View>
              </View>
              <View style={styles.titleWrapper}>
                <Pressable
                  style={
                    gender === 'MAN'
                      ? [styles.smallBtn, styles.leftmargin, styles.btnOn]
                      : [styles.smallBtn, styles.leftmargin, styles.btnOff]
                  }
                  onPress={() => {
                    ToggleButton('MAN')
                  }}
                >
                  <Text style={[styles.smallBtnText]}>남</Text>
                </Pressable>

                <Pressable
                  style={
                    gender === 'WOMAN'
                      ? [styles.smallBtn, styles.leftmargin, styles.btnOn]
                      : [styles.smallBtn, styles.leftmargin, styles.btnOff]
                  }
                  onPress={() => {
                    ToggleButton('WOMAN')
                  }}
                >
                  <Text style={[styles.smallBtnText]}>여</Text>
                </Pressable>
              </View>
            </View>
            <View style={globalStyle.textField}>
              <TextField
                title={'생년월일'}
                input={birthday}
                name="birthday"
                height={55}
                isMandatory={true}
                placeholder={'예) 19910705'}
                setInput={(input) => {
                  const regex = /^[|0-9|]*$/
                  if (regex.test(input) && input.length <= 8) {
                    //setBirthday(input)
                    userDispatch({ type: 'SET_MEMBER_BIRTHDAY', payload: { birthday: input } })
                  }
                }}
              />
            </View>
          </>
        )}

        <View style={globalStyle.textField}>
          <TextField
            title={'자기 소개'}
            input={intro}
            name="userContext"
            height={130}
            isMultiLine={true}
            setInput={(text) => {
              userDispatch({ type: 'SET_MEMBER_INTRO', payload: { intro: text } })
            }}
          />
        </View>
        <Text style={styles.notificationText}>
          {role === 'MEMBER'
            ? '나의 트레이너에게 보여지는 정보입니다.'
            : '나의 회원들에게 보여지는 정보입니다.'}
        </Text>
        <ButtonLarge
          name={'가입완료'}
          isEnable={buttonEnable}
          onPress={() => {
            if (birthDayValidCheck(birthday) === false) {
              alert('생년월일을 정확히 입력해주세요.')
              return
            }
            if (role === 'MEMBER') {
              const birthdayFormat =
                birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2)
              var payload = {
                name: name,
                description: intro,
                gender: gender,
                birthday: birthdayFormat,
                provider: provider,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn,
              }
              _axios
                .post('/auth/signup/member', payload)
                .then((res) => {
                  if (res.status === 200) {
                    var payload = {
                      accessToken: accessToken,
                      provider: provider,
                    }
                    return new Promise((resolve, reject) => {
                      resolve(payload)
                    })
                  } else {
                    return new Promise((resolve, reject) => {
                      reject(res.status)
                    })
                  }
                })
                .catch((err) => {
                  if (err.response.data.code === -11) {
                    alert('이미 회원가입이 되어있습니다.')
                  }
                })
                .then((payload) => {
                  return _axios.post('/auth/signin', payload)
                })
                .then(async (res) => {
                  await AsyncStorage.setItem('PROVIDER', provider)
                  await AsyncStorage.setItem('ACCESSTOKEN', accessToken)
                  userDispatch({
                    type: 'SET_JWT_TOKEN',
                    payload: { jwtToken: res.data.data.token },
                  })
                  if (image !== null) {
                    await uploadImage(res.data.data.token)
                  }
                  const param = {
                    userDispatch: userDispatch,
                    jwtToken: res.data.data.token,
                  }
                  initializeUserInfo(param)
                  navigation.replace('Home')
                })
            } else {
              var payload = {
                name: name,
                description: intro,
                provider: provider,
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn,
              }
              _axios
                .post('/auth/signup/trainer', payload)

                .then((res) => {
                  if (res.status === 200) {
                    var payload = {
                      accessToken: accessToken,
                      provider: provider,
                    }
                    return new Promise((resolve, reject) => {
                      resolve(payload)
                    })
                  } else {
                    return new Promise((resolve, reject) => {
                      reject(res.status)
                    })
                  }
                })
                .catch((err) => {
                  if (err.response.data.code === -11) {
                    alert('이미 회원가입이 되어있습니다.')
                  }
                })
                .then((payload) => {
                  return _axios.post('/auth/signin', payload)
                })
                .then(async (res) => {
                  await AsyncStorage.setItem('PROVIDER', provider)
                  await AsyncStorage.setItem('ACCESSTOKEN', accessToken)
                  userDispatch({
                    type: 'SET_JWT_TOKEN',
                    payload: { jwtToken: res.data.data.token },
                  })
                  if (image !== null) {
                    await uploadImage(res.data.data.token)
                  }
                  const param = {
                    userDispatch: userDispatch,
                    jwtToken: res.data.data.token,
                  }
                  initializeUserInfo(param)
                  navigation.replace('Home')
                })
                .catch((e) => console.log(e))
            }
          }}
        />
      </View>
    </InputScrollView>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    marginTop: 30,
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E101FF',
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#5A5757',
    margin: 5,
  },
  notificationText: {
    alignSelf: 'stretch',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
    color: '#5A5757',
    lineHeight: 22,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'NotoSansKRMedium',
  },
  appbarTitle: {
    ...globalStyle.header,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    marginBottom: 0,
  },
  titleWrapper: {
    flexDirection: 'row',
  },
  titleText: {
    ...globalStyle.heading2,
  },
  labelWrapper: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C2C7CC',
    borderRadius: 6,
  },
  smallBtn: {
    ...globalStyle.body2Bold,
    width: 90,
    height: 50,
    borderRadius: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  btnOn: {
    ...globalStyle.buttonLightGreen,
  },
  btnOff: {
    ...globalStyle.inputGrey,
    borderWidth: 1,
  },
  leftmargin: {
    marginRight: 8,
  },
  smallBtnText: {
    ...globalStyle.body2Bold,
    textAlign: 'center',
  },
})
