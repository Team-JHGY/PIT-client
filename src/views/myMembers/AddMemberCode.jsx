import React, { useState, useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  Modal,
  AsyncStorage
} from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper'
import arrow_left from '../../../assets/arrow_left.png'
import cross from '../../../assets/cross.png'
import ButtonLarge from '../../components/Common/ButtonLarge'
import { decode } from 'js-base64';

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config" 

export default function AddMembersCode({ navigation }) {
  const [text, onChangeText]                = React.useState(null)
  const [modalVisible, setModalVisible]     = useState(false)
  const [disableBtn, setDisableBtn]         = useState(false)
  const [modalUserData, setModalUserData]   = React.useState([])
  const [userData, setUserData]             = React.useState({

    "createdAt": "",
    "id": "",
    "modifedAt": "",
    "user": {
        "accessToken": "",
        "code": "",
        "description": "",
        "expiresIn": "",
        "id": "",
        "name": "",
        "oauthId": "",
        "profileImage": "",
        "provider": "",
        "refreshToken": "",
        "type": "",
    }

  })

  const { userState, userDispatch }     = useContext(UserContext)

  //jwt token decode
  const splitJwt = userState.jwtToken.split(".")
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))


  function RegCheckName(text) {
    const regex = /^[a-z|A-Z|0-9|]+$/;

    if(text === null || text === undefined || text.length >= 5){
      setDisableBtn(false)
      if(regex.test(text) === true){
        onChangeText(text)
        setDisableBtn(true)
      }else{
        alert("영어, 숫자외에는 입력이 불가합니다.")
        setDisableBtn(false)
      }
    }
  }

  function AddCodePartners(){

    fetch(`${config.BASE_URL}/users/code/${text}`,{
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
        console.log("test",res)
        if(res.code ===  0){
          setModalVisible(true)
          setModalUserData(res.data)
            //완료
            //navigation.goBack()
        }else if(res.code === -13){
            alert(res.data)
        }
    })
    .catch((e) => console.log(e))

  }

  function RelationPartner() {
    setModalVisible(false)
      
    var bodyForm
    if(modalUserData.type === "TRAINER"){
      bodyForm = { 
        trainerId : String(modalUserData.id),
        memberId  : String(userInfo[0].sub)
      }
    }else{
      bodyForm = { 
        trainerId : String(userInfo[0].sub),
        memberId  : String(modalUserData.id)
      }
    }


    fetch(`${config.BASE_URL}/partners`,{
      method      : 'POST', // *GET, POST, PUT, DELETE, etc.
      cache       : 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials : 'include', // include, *same-origin, omit
      headers: {
          'Authorization' : userState.jwtToken,
          'Content-Type'  : 'application/json',
          
      },
      body: JSON.stringify(bodyForm)
    })
    .then((res) => res.json())
    .then((res) => {
        console.log("test",res)
        if(res.code ===  0){
          alert("완료 되었습니다.")
          //완료
          navigation.goBack()
          //초기화
          bodyForm.length = 0;
        }else if(res.code === -13){
          alert(res.data)
        }
    })
    .catch((e) => console.log(e))

  }

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
            
            if(res.code ===  0){
                setUserData(res.data)
                
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
            
            if(res.code ===  0){
                setUserData(res.data)
                
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

  return (
    <>
      {/*네비게이션 형태가 다 달라서 컴포넌트 별 개별 추가 진행*/}
      <Appbar.Header style={[globalStyle.titleAppbar]}>
        <Pressable style={[globalStyle.iconSize, globalStyle.absolute]} onPress={() => navigation.goBack()}>
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content 
          title={userInfo.type === "MEMBER"? "트레이너코드 입력으로 ":"회원코드 입력으로 추가"} 
          titleStyle={[globalStyle.header,globalStyle.center]} 
        />
      </Appbar.Header>

      {/* View 부분 */}
      <SafeAreaView style={styles.mainForm}>
        <View style={styles.viewPadding}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <View style={modalstyles.centeredView}>
              <View style={modalstyles.modalView}>
                <View style={modalstyles.row}>
                  <Text style={[globalStyle.heading2, modalstyles.headerText]}>
                    {userInfo.type === "MEMBER"? 
                      "트레이너 확인"
                      :
                      "회원확인"
                    }    
                  </Text>
                  <Pressable
                    style={modalstyles.cross}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Image source={cross} style={modalstyles.cross} />
                  </Pressable>
                </View>
                <View style={modalstyles.UserInfo}>
                  {modalUserData.profileImage !== null ? (
                    <Image source={{ uri: modalUserData.profileImage }} style={modalstyles.UserImg} />
                  ) : (
                    <Image
                      style={modalstyles.UserImg}
                      source={require('../../../assets/img/SignUp/emptyProfile.png')}
                    ></Image>
                  )}
                 

                  <Text style={globalStyle.heading2}>{modalUserData.name}</Text>
                  {userInfo.type === "MEMBER"?
                    null
                    :
                    <Text style={globalStyle.body2}>({modalUserData.name}, ??세)</Text>
                  } 
                  <Text style={[globalStyle.body2, modalstyles.infoText]}>
                    {userInfo.type === "MEMBER"? 
                      "추가하려는 트레이너 선생님이 맞는지 확인해주세요."
                      :
                      "추가하려는 회원님이 맞는지 확인해주세요."
                    }
                  </Text>

                  <View style={modalstyles.row}>
                    <Pressable
                      style={[modalstyles.button, modalstyles.buttonClose, modalstyles.margin_right,globalStyle.center]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text
                        style={[globalStyle.textDarkRed, globalStyle.button, modalstyles.btnText]}
                      >
                        취소
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[modalstyles.button, modalstyles.buttonOpen, globalStyle.center]}
                      onPress={() => RelationPartner()}
                    >
                      <Text style={[globalStyle.button, modalstyles.btnText]}>
                        확인
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Text style={globalStyle.heading2}>{userInfo.type === "MEMBER"? "트레이너 코드":"회원 코드"}</Text>
          
          <TextInput style={styles.input} onChangeText={(text)=>RegCheckName(text)} value={text} />

          <Text style={styles.infoText}>
          {userInfo.type === "MEMBER"?
            "추가하려는 트레이너님의 앱 마이 > 트레이너 코드에서 확인할 수 있습니다."
            :
            "추가하려는 회원님의 앱에서 마이 > 회원코드에서 회원코드를 확인할 수 있습니다."
          }
          </Text>
        </View>
        
          <ButtonLarge name={'추가'} isEnable={disableBtn} onPress={()=>AddCodePartners()} />
     
      </SafeAreaView>
    </>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainForm: {
    backgroundColor: '#ffff',
    flex: 1,
  },

  infoText: {
    ...globalStyle.body2,
    ...globalStyle.textDartGery,
    textAlign: 'justify',
    letterSpacing: 2.3,
    lineHeight: 18,
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  viewPadding: {
    padding: 20,
  },
  input: {
    ...globalStyle.body2,
    height: 56,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C2C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  UserInfo: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 10,
    width: '65%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 110,
    height: 60,
    borderRadius: 5,
    padding: 10,
  },
  margin_right:{
    marginRight:10
  },
  buttonOpen: {
    backgroundColor: '#2AFF91',
  },
  buttonClose: {
    borderColor: '#FF8989',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  cross: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 17,
    height: 17,
  },
  headerText: {
    textAlign: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  row: {
    flexDirection: 'row',
  },
  UserImg: {
    margin: 'auto',
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#11F37E',
    marginBottom: 6,
  },
  infoText: {
    ...globalStyle.textDartGery,
    textAlign: 'center',
    width: 170,
    marginBottom: 15,
  },
  btnText: {
    textAlign: 'center',
    ...globalStyle.center
  },
})
