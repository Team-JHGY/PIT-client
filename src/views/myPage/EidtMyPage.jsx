import React from 'react'
import { View, Text, StyleSheet, Image, Platform, Pressable,SafeAreaView, ScrollView } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import { Appbar } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import globalStyle from '../../utils/globalStyle'
import TextField from '../../components/Common/TextField'
import ButtonLarge from '../../components/Common/ButtonLarge'
import ButtonSmall from '../../components/Common/ButtonSmall'
import ButtonSmallRed from '../../components/Common/ButtonSmallRed'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import Asterisk from '../../../assets/icon/asterisk.svg'

import { decode } from 'js-base64';

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config"

export default function EditMyPage ({navigation,userData}) {

  const [image, setImage]               = React.useState(null)
  const [name, setName]                 = React.useState('')
  const [intro, setIntro]               = React.useState('')
  const [buttonEnable,setButtonEnable]  = React.useState(false)
  const [birthday, setBirthday]         = React.useState()
  const [gender, setGender]             = React.useState('M')
  const { userState, userDispatch }     = React.useContext(UserContext)
  const splitJwt                        = userState.jwtToken.split(".")
  const userInfo                        = React.useState(JSON.parse(decode(splitJwt[1])))

  function AddtoLocalUserAuth(){
    if(userInfo[0].type === "MEMBER"){
        fetch(`${config.BASE_URL}/members/${userInfo[0].sub}`,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Authorization' : userState.jwtToken,
                'Content-Type'  : 'application/json',
                
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data)
            if(res.code ===  0){
              setName(res.data.user.name)
              setBirthday(res.data.birthday)
              setGender(res.data.gender)
              setIntro(res.data.user.description)
            }else if(res.code === -13){
                setUserData([])
            }
            

        })
        .catch((e) => console.log(e))
    }else{
        fetch(`${config.BASE_URL}/trainers/${userInfo[0].sub}`,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Authorization' : userState.jwtToken,
                'Content-Type'  : 'application/json',
                
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data)
            if(res.code ===  0){
              setName(res.data.user.name)
              setGender(res.data.gender)
              setIntro(res.data.user.description)
                
            }else if(res.code === -13){
                setUserData([])
            }
            

        })
        .catch((e) => console.log(e))
    }
  }

  React.useEffect(()=>{
    AddtoLocalUserAuth()
  },[])

  //사용자 이미지 저장
  React.useEffect(() => {
    console.log(userData)
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })

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

    let smallresult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    })


    
    const imageValue = {
      uri   : result.uri,
      name  : "test",
      type  : "image/jpeg"
    }
    const smallimageValue = {
      uri   : smallresult.uri,
      name  : "test",
      type  : "image/jpeg"
    }
    

   
    const formData = new FormData()
      formData.append("profile", imageValue)
      formData.append("thumbnail", smallimageValue)
      setImage(result.uri)
      
      fetch(`${config.BASE_URL}/profile-image/${userInfo[0].sub}`,formData,{
        method  : 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Authorization' : userState.jwtToken,
            'Content-Type'  : 'multipart/form-data',
            
        }
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.code !== 0){
          alert(res.data)
        }

      })
      .catch((e) => console.log(e))
    
  }


  function ToggleButton(gender) {
    setGender(gender);
  }

  function RegCheckName(name) {
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
    if(regex.test(name) === false){
      alert("한글, 영어, 숫자외에는 입력이 불가합니다.")
    }else{
      setName(name)
    }
  }

  function EditMyinfo(){
    if(userInfo[0].type === "MEMBER"){
      console.log({
        "name"        : name,
        "gender"      : gender,
        "birthday"    : birthday,
        "description" : intro
        
      })
      fetch(`${config.BASE_URL}/members/${userInfo[0].sub}`,{
          method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'include', // include, *same-origin, omit
          headers: {
              'Authorization' : userState.jwtToken,
              'Content-Type'  : 'application/json',
          },
          body: JSON.stringify({
            "name"        : name,
            "gender"      : gender,
            "birthday"    : birthday,
            "description" : intro
            
          })
      })
      .then((res) => res.json())
      .then((res) => {
          console.log(res.data)
          if(res.code ===  0){
            alert("편집 완료했습니다.")
            //AsyncStorage.setItem('reload', "true")
            navigation.goBack()
          }else{
            alert("편집 실패했습니다.")
          }
          

      })
      .catch((e) => console.log(e))
    }else{
      console.log({
        "name"        : name,
        "gender"      : gender,
        "birthday"    : birthday,
        "description" : intro
        
      })
      fetch(`${config.BASE_URL}/trainers/${userInfo[0].sub}`,{
          method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'include', // include, *same-origin, omit
          headers: {
              'Authorization' : userState.jwtToken,
              'Content-Type'  : 'application/json',  
          },
          body: JSON.stringify({
            "name"        : name,
            "gender"      : gender,
            "birthday"    : birthday,
            "description" : intro
            
          })
      })
      .then((res) => res.json())
      .then((res) => {
          console.log(res.data)
          if(res.code ===  0){
            alert("편집 완료했습니다.")
            //AsyncStorage.setItem('reload', "true")
            navigation.goBack()
          }else{
            alert("편집 실패했습니다.")
          }
          

      })
      .catch((e) => console.log(e))
    }
  }

  return (
    <>
       <SafeAreaView>
        <ScrollView>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content title="편집" titleStyle={[styles.appbarTitle, globalStyle.center]} />
        <Pressable
          style={[globalStyle.header,globalStyle.absoluteRight, { marginLeft: 'auto', paddingRight: 10 }]}
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
            setInput={(name) => RegCheckName(name)}
          />
        </View>
        { userInfo[0].type === "TRAINER"?
          null
          :
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
                style={gender === "MAN"?[styles.smallBtn, styles.leftmargin, styles.btnOn]:[styles.smallBtn, styles.leftmargin, styles.btnOff]} 
                onPress={()=>{ToggleButton("MAN")}}
              >
                <Text style={[styles.smallBtnText]}>남</Text>
              </Pressable>

              <Pressable 
                style={gender === "WOMAN"?[styles.smallBtn, styles.leftmargin, styles.btnOn]:[styles.smallBtn, styles.leftmargin, styles.btnOff]}
                onPress={()=>{ToggleButton("WOMAN")}}
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
              const regex = /^[|0-9-|]*$/
              if (regex.test(input) && input.length <= 10) {
                setBirthday(input)
              }
            }}
           />
         </View>
         </>
         
      
        }
        <View style={globalStyle.textField}>
          <TextField
            title={'자기 소개'}
            input={intro}
            height={130}
            isMultiLine={true}
            setInput={setIntro}
          />
        </View>
        <Text style={styles.notificationText}>
          {userInfo[0].type === "MEMBER"?  "나의 트레이너에게 보여지는 정보입니다." : "나의 회원들에게 보여지는 정보입니다."}
        </Text>
        
          <ButtonLarge name={'편집완료'} isEnable={buttonEnable} onPress={()=>EditMyinfo()} />
        
      </View>
      </ScrollView>
      </SafeAreaView>
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
    marginTop: 20,
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
    marginBottom:20,
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
  smallBtn:{
    ...globalStyle.body2Bold,
    width:90,
    height:50,
    borderRadius:10,
    textAlign: 'center',
    justifyContent:"center"
  },
  btnOn:{
    ...globalStyle.buttonLightGreen
  },
  titleText: {
    ...globalStyle.heading2,
  },
  btnOff : {
    ...globalStyle.inputGrey,
    borderWidth:1
  },
  leftmargin:{
    marginRight:8
  },
  smallBtnText:{
    ...globalStyle.body2Bold,
    textAlign:"center",
  },
  titleWrapper: {
    flexDirection: 'row',
  },

})


