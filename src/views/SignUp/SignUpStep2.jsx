import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, Platform, Button, Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import globalStyle from '../../utils/globalStyle'
import TextField from '../../components/Common/TextField'
import ButtonLarge from '../../components/Common/ButtonLarge'
import ButtonSmall from '../../components/Common/ButtonSmall'
import ButtonSmallRed from '../../components/Common/ButtonSmallRed'

const SignUpStep2 = ({ goBackStep, image, setImage, name, setName, intro, setIntro }) => {
  const [buttonEnable, setButtonEnable] = useState('false')

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])
  useEffect(() => {
    if (name.length > 0) setButtonEnable(true)
    else setButtonEnable(false)
  }, [name])
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
  return (
    <View style={styles.body}>
      {image !== null ? (
        <Image source={{ uri: image }} style={styles.profile} />
      ) : (
        <Image
          style={styles.profile}
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
        <TextField title={'이름'} input={name} height={55} isMandatory={true} setInput={setName} />
      </View>
      <View style={globalStyle.textField}>
        <TextField
          title={'자기 소개'}
          input={intro}
          height={100}
          isMultiLine={true}
          setInput={setIntro}
        />
      </View>
      <Text style={styles.notificationText}>나의 회원들에게 보여지는 정보입니다.</Text>
      <ButtonLarge name={'가입완료'} isEnable={buttonEnable} />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    marginTop: 85,
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
})

export default SignUpStep2
