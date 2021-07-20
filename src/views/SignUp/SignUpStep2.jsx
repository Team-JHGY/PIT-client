import React, { useState, useEffect } from 'react'
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
import { WithLocalSvg } from 'react-native-svg'
import { Appbar } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import globalStyle from '../../utils/globalStyle'
import TextField from '../../components/Common/TextField'
import ButtonLarge from '../../components/Common/ButtonLarge'
import ButtonSmall from '../../components/Common/ButtonSmall'
import ButtonSmallRed from '../../components/Common/ButtonSmallRed'

//icons image
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import arrow_left from '../../../assets/arrow_left.png'
import Asterisk from '../../../assets/icon/asterisk.svg'

export default function SignUpStep2(props) {
  const [buttonEnable, setButtonEnable] = React.useState('false')
  const [userAuth, setUserAuth] = React.useState()
  const [image, setImage] = React.useState(null)
  const [name, setName] = React.useState('')
  const [birthday, setBirthday] = React.useState()
  const [gender, setGender] = React.useState('M')
  const [userContext, setUsetContext] = React.useState()

  const { goBackStep, openModal, onPress } = props //앞에서 전달받은 정보

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
    AddtoLocalUserAuth()
  }, [])

  useEffect(() => {
    if (name.length > 0) setButtonEnable(true)
    else setButtonEnable(false)
  }, [name])

  function AddtoLocalUserAuth() {
    AsyncStorage.getItem('userAuth', (err, result) => {
      //user_id에 담긴 아이디 불러오기
      setUserAuth(result) // result에 담김 //불러온거 출력
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  function ToggleButton(gender) {
    setGender(gender)
  }

  return (
    <>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Pressable style={globalStyle.iconSize} onPress={() => goBackStep()}>
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content
          title={userAuth === 'member' ? '회원으로 가입' : '트레이너로 가입'}
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
              userAuth === 'member' ? [styles.profile, { borderColor: '#11F37E' }] : styles.profile
            }
            source={require('../../../assets/img/SignUp/emptyProfile.png')}
          ></Image>
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

        <View style={globalStyle.textField}>
          <TextField
            title={'이름'}
            name="name"
            input={name}
            height={55}
            isMandatory={true}
            setInput={(text) => setName(text)}
          />
        </View>
        {userAuth !== 'member' ? null : (
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
                    gender === 'M'
                      ? [styles.smallBtn, styles.leftmargin, styles.btnOn]
                      : [styles.smallBtn, styles.leftmargin, styles.btnOff]
                  }
                  onPress={() => {
                    ToggleButton('M')
                  }}
                >
                  <Text style={[styles.smallBtnText]}>남</Text>
                </Pressable>

                <Pressable
                  style={
                    gender === 'F'
                      ? [styles.smallBtn, styles.leftmargin, styles.btnOn]
                      : [styles.smallBtn, styles.leftmargin, styles.btnOff]
                  }
                  onPress={() => {
                    ToggleButton('F')
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
                setInput={(text) => setBirthday(text)}
              />
            </View>
          </>
        )}

        <View style={globalStyle.textField}>
          <TextField
            title={'자기 소개'}
            input={userContext}
            name="userContext"
            height={130}
            isMultiLine={true}
            setInput={(text) => setUsetContext(text)}
          />
        </View>
        <Text style={styles.notificationText}>
          {userAuth === 'member'
            ? '나의 트레이너에게 보여지는 정보입니다.'
            : '나의 회원들에게 보여지는 정보입니다.'}
        </Text>
        <ButtonLarge name={'가입완료'} isEnable={buttonEnable} onPress={onPress} />
      </View>
    </>
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
