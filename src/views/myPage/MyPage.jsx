import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image, ScrollView } from 'react-native'
import Clipboard from 'expo-clipboard'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper'
import arrow_right from '../../../assets/arrow_right.png'
import Toast from 'react-native-easy-toast'
import { decode } from 'js-base64'
import emptyProfile from '../../../assets/img/SignUp/emptyProfile.png'

// context
import { UserContext } from '../../store/user'
import config from '../../utils/config'

export default function MyPage({ navigation }) {
  const [trainer, setTrainer] = React.useState('')
  const [count, setCount] = React.useState(0)
  const [userData, setUserData] = React.useState({
    createdAt: '',
    id: '',
    modifedAt: '',
    user: {
      accessToken: '',
      code: '',
      description: '',
      expiresIn: '',
      id: '',
      name: '',
      oauthId: '',
      profileImage: [],
      provider: '',
      refreshToken: '',
      type: '',
    },
  })
  const toastRef = React.useRef()
  const { userState, userDispatch } = React.useContext(UserContext)

  //jwt token decode
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))

  React.useEffect(() => {
    AddtoLocalUserAuth()
    MyTrainersList(userState.jwtToken)
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AddtoLocalUserAuth()
    })
    return unsubscribe
  }, [navigation])

  const copyToClipboard = () => {
    Clipboard.setString(String(userData.user.code))
    toastRef.current.show('클립보드에 복사했습니다.')
  }

  //연결된 트레이너 숫자 구하기
  async function MyTrainersList(token) {
    if (userInfo[0].type === 'MEMBER') {
      await fetch(`${config.BASE_URL}/partnerships/${userInfo[0].sub}/trainers`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 0) {
            let activatedTrainerInfo = res.data.trainers.find((v, i) => {
              if (v.isEnabled === true) return true
            })
            if (activatedTrainerInfo.trainers.length !== 0) {
              setTrainer(activatedTrainerInfo.trainer.user.name)
              setCount(res.data.trainers.length)
            }
          } else {
            alert('fail')
            setCount(0)
          }
        })
        .catch((e) => console.log(e))
    }
  }

  function AddtoLocalUserAuth() {
    if (userInfo[0].type === 'MEMBER') {
      fetch(`${config.BASE_URL}/members/${userInfo[0].sub}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 0) {
            setUserData(res.data)
            //console.log("res.data", res.data)
          } else if (res.code === -13) {
            setUserData([])
          }
        })
        .catch((e) => console.log(e))
    } else {
      fetch(`${config.BASE_URL}/trainers/${userInfo[0].sub}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 0) {
            setUserData(res.data)
            //console.log("res.data", res.data)
          } else if (res.code === -13) {
            setUserData([])
          }
        })
        .catch((e) => console.log(e))
    }
  }

  return (
    <>
      <Toast
        ref={toastRef}
        positionValue={100}
        fadeInDuration={200}
        fadeOutDuration={1000}
        style={{ backgroundColor: 'rgba(0,0,0, 0.5)', width: '90%' }}
      />
      <Appbar.Header style={globalStyle.appbarMain}>
        <Appbar.Content title="마이" titleStyle={[globalStyle.heading1, styles.barHeader]} />
        <Pressable
          style={[
            globalStyle.appbarBtn,
            globalStyle.buttonGrey,
            globalStyle.center,
            styles.editWidth,
            styles.margin_right,
          ]}
          onPress={(userData) => navigation.navigate('EditMyPage')}
        >
          <Text style={globalStyle.appbarBtnText}>편집</Text>
        </Pressable>
        <Text></Text>
      </Appbar.Header>
      <SafeAreaView style={styles.mainForm}>
        <ScrollView>
          <View style={styles.myPageInfoImg}>
            {userData.user.profileImage.length === 0 ? (
              <Image
                style={styles.userImg}
                source={require('../../../assets/img/SignUp/emptyProfile.png')}
              />
            ) : (
              <Image source={{ uri: userData.user.profileImage.path }} style={styles.userImg} />
            )}
          </View>

          {userInfo[0].type === 'MEMBER' ? (
            <Pressable
              style={[
                styles.myPageInfo,
                globalStyle.row,
                globalStyle.buttonLightGreen,
                styles.trainerBtn,
              ]}
              onPress={() => {
                navigation.navigate('MyTrainers')
              }}
            >
              <View style={[globalStyle.col_1, styles.alignCenter, styles.padding_Left]}>
                <Text style={(globalStyle.body2, globalStyle.textDartGery)}>현재 트레이너</Text>
                <Text style={globalStyle.heading2}>{trainer === '' ? '없음' : trainer}</Text>
              </View>
              <View style={[globalStyle.col_2, styles.alignCenter, styles.padding_Left]}>
                <Text style={(globalStyle.body2, globalStyle.textDartGery)}>
                  함께 운동했던 선생님들
                </Text>
                <Text style={globalStyle.heading2}>총 {count} 명</Text>
              </View>
              <View style={[globalStyle.col_1, styles.alignCenter, styles.padding_Left]}>
                <Image source={arrow_right} style={styles.arrow_right} />
              </View>
            </Pressable>
          ) : null}
          <View style={[styles.myPageInfo]}>
            <Text style={[globalStyle.heading2, styles.userName]}>이름</Text>
            <Text style={[globalStyle.body2, styles.userNameInfo]}>{userData.user.name}</Text>
          </View>
          {userInfo[0].type === 'MEMBER' ? (
            <>
              <View style={[styles.myPageInfo]}>
                <Text style={[globalStyle.heading2, styles.userName]}>성별</Text>
                <Text style={[globalStyle.body2, styles.userNameInfo]}>
                  {userData.gender === 'WOMAN' ? '여' : '남'}
                </Text>
              </View>
              <View style={[styles.myPageInfo]}>
                <Text style={[globalStyle.heading2, styles.userName]}>생년월일</Text>
                <Text style={[globalStyle.body2, styles.userNameInfo]}>{userData.birthday}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.myPageInfo}>
            <Text style={[globalStyle.heading2, styles.userName]}>자기 소개</Text>
            <Text style={[globalStyle.body2, styles.userNameInfo]}>
              {userData.user.description}
            </Text>
          </View>
          <View style={[styles.myPageInfo, globalStyle.row]}>
            <View style={globalStyle.col_1}>
              <Text style={[globalStyle.heading2, styles.userName]}>
                {userInfo[0].type === 'MEMBER' ? '회원코드' : '트레이너 코드'}
              </Text>
              <Text style={[globalStyle.body2, styles.userNameInfo]}>{userData.user.code}</Text>
            </View>
            <View style={(globalStyle.col_1, styles.alignCenter)}>
              <Pressable
                style={[globalStyle.appbarBtn, globalStyle.buttonGrey, styles.copyBtn]}
                onPress={copyToClipboard}
              >
                <Text style={globalStyle.appbarBtnText}>복사</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.myPageInfoImg, styles.logOut]}>
            <Pressable style={styles.BasicBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={[globalStyle.body2, styles.BasicBtnText]}>로그아웃</Text>
            </Pressable>
          </View>
          <View style={[styles.logOut]}>
            <Text style={globalStyle.textDimmedGrey}>v.1.0</Text>
          </View>
        </ScrollView>
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
  profile: {
    marginTop: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E101FF',
  },
  disableText: {
    ...globalStyle.body2,
    opacity: 0.3,
  },
  barHeader: {
    textAlign: 'left',
    width: '100%',
  },
  myPageInfoImg: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImg: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#E101FF',
    marginBottom: 10,
  },
  myPageInfo: {
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameInfo: {
    marginBottom: 10,
  },
  BasicBtn: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    ...globalStyle.buttonGrey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BasicBtnText: {
    ...globalStyle.button,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logOut: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  alignCenter: {
    justifyContent: 'center',
  },
  copyBtn: {
    width: 60,
    textAlign: 'center',
    justifyContent: 'center',
  },
  editWidth: {
    width: 60,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerBtn: {
    height: 94,
    borderRadius: 10,
    marginTop: 10,
  },
  arrow_right: {
    width: 30,
    height: 30,
  },
  padding_Left: {
    paddingLeft: 20,
  },
  margin_right: {
    marginRight: 15,
  },
})
