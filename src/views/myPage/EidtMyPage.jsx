import React from 'react'
import { View, Text, StyleSheet, Image, Platform, Button, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import { Appbar } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import globalStyle from '../../utils/globalStyle'
import TextField from '../../components/Common/TextField'
import ButtonLarge from '../../components/Common/ButtonLarge'
import ButtonSmall from '../../components/Common/ButtonSmall'
import ButtonSmallRed from '../../components/Common/ButtonSmallRed'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'


export default function EditMyPage ({navigation}) {

  const [image, setImage]               = React.useState(null)
  const [name, setName]                 = React.useState('test')
  const [intro, setIntro]               = React.useState('')
  const [buttonEnable,setButtonEnable]  = React.useState(false)

  
  React.useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])
  React.useEffect(() => {
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
    <>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content title="편집" titleStyle={styles.appbarTitle} />
        <Pressable
          style={(globalStyle.header, { marginLeft: 'auto', paddingRight: 20 })}
          onPress={()=>navigation.goBack()}
        >
          <WithLocalSvg asset={closeIcon} />
        </Pressable>
      </Appbar.Header>
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
          <TextField
            title={'이름'}
            input={name}
            height={55}
            isMandatory={true}
            setInput={setName}
          />
        </View>
        <View style={globalStyle.textField}>
          <TextField
            title={'자기 소개'}
            input={intro}
            height={130}
            isMultiLine={true}
            setInput={setIntro}
          />
        </View>
        <Text style={styles.notificationText}>나의 회원들에게 보여지는 정보입니다.</Text>
        <View style={globalStyle.BottomBtnMainForm}>
          <Pressable style={globalStyle.BasicBtn} onPress={() => navigation.goBack()}>
            <Text style={globalStyle.BasicBtnText}>추가</Text>
          </Pressable>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:"#ffffff"
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
})


