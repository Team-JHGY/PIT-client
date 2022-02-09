import React from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { SliderBox } from 'react-native-image-slider-box'

// utils
import globalStyle from '../../utils/globalStyle'
import { getDayOfWeek, getTimeOfDate } from '../../utils/commonFunctions'

import { decode } from 'js-base64'

// assets
import cross from '../../../assets/cross.png'
import happy from '../../../assets/img/mealPlan/happy.png'
import Netural from '../../../assets/img/mealPlan/Netural.png'
import Sad from '../../../assets/img/mealPlan/Sad.png'
import emptyProfile from '../../../assets/img/SignUp/emptyProfile.png'

// context
import { UserContext } from '../../store/user'
import config from '../../utils/config'

export default function MealCommentPage({ navigation, route }) {
  const { mealId, dateValue } = route.params

  // state
  const { userState, userDispatch } = React.useContext(UserContext)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))

  const [infoData, setInfoData] = React.useState({
    type: '',
    description: '',
    score: '',
    timestamp: new Date(),
  })
  const [images, setImages] = React.useState([])
  const [delStatus, setDelStatus] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [comment, setComment] = React.useState([])
  const titleDate = `${dateValue.getMonth() + 1}/${dateValue.getDate()}(${getDayOfWeek(dateValue)})`

  async function GetMealInformation() {
    await fetch(`${config.BASE_URL}/diet/${mealId}`, {
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
        console.log('젠장', res)
        if (res.code === 0) {
          setInfoData(res.data)
          if (res.data.images.length !== 0) {
            let list = []
            res.data.images.forEach((element) => {
              list.push(element.path)
            })
            setImages(list)
          }
        }
      })
      .catch((e) => {
        alert('식단 조회를 실패했습니다.')
        console.log(e)
      })
  }

  React.useEffect(() => {
    GetMealInformation()
    GetMealComment()
  }, [])

  async function DelMealPlan() {
    await fetch(`${config.BASE_URL}/diet/${mealId}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
          alert('식단 삭제를 성공했습니다.')
        } else {
          alert('식단 삭제를 실패했습니다.')
        }
        navigation.goBack()
      })
      .catch((e) => {
        alert('식단 삭제를 실패했습니다.')
        console.log(e)
      })
  }

  async function PostAddMealComment() {
    const addDietCommentRequestForm = {
      comment: input,
      userId: Number(userInfo[0].sub),
    }
    if (input.length !== 0) {
      await fetch(`${config.BASE_URL}/diet/${mealId}/comment`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addDietCommentRequestForm),
      })
        .then((res) => res.json())
        .then((res) => {
          GetMealComment()
          setInput('')
        })
        .catch((e) => {
          alert('코멘트 생성을 실패했습니다.')
          console.log(e)
        })
    }
  }

  async function GetMealComment() {
    await fetch(`${config.BASE_URL}/diet/${mealId}/comment`, {
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
          setComment(res.data)
          //console.log("코멘트 조회",res.data)
        } else {
          alert('코멘트 조회을 실패했습니다.')
        }
      })
      .catch((e) => {
        alert('코멘트 조회을 실패했습니다.')
        console.log(e)
      })
  }

  async function DelMealComment(id) {
    await fetch(`${config.BASE_URL}/diet/comment/${id}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
          GetMealComment()
        } else {
          alert('코멘트 삭제를 실패했습니다.')
        }
      })
      .catch((e) => {
        alert('코멘트 삭제를 실패했습니다.')
        console.log(e)
      })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetMealInformation()
    })
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <ScrollView>
        <Appbar.Header style={globalStyle.titleAppbar}>
          <Appbar.Content
            title={`${titleDate} 식단 기록`}
            titleStyle={[globalStyle.heading1, globalStyle.center]}
          />

          <Pressable
            style={[globalStyle.header, globalStyle.absoluteRight]}
            onPress={() => navigation.goBack()}
          >
            <Image source={cross} style={globalStyle.title} />
          </Pressable>
        </Appbar.Header>

        <View style={{ flex: 1, backgroundColor: '#eee' }}>
          <View style={{ height: 360, backgroundColor: '#eee' }}>
            {images.length === 0 ? (
              //이미지가 없을때
              <Text
                style={[
                  {
                    textAlign: 'center',
                    marginTop: 150,
                    fontSize: 36,
                    color: 'rgba(0,0,0,0.3)',
                    fontWeight: 'bold',
                  },
                ]}
              >
                NO DATA
              </Text>
            ) : (
              //이미지 갯수에 따라 슬랑이드 만들기
              <SliderBox
                ImageComponentStyle={{ width: '100%', height: 360 }}
                images={images}
                circleLoop
              />
            )}
          </View>
          <View style={{ padding: 20, backgroundColor: '#FFF' }}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={[globalStyle.heading2, { flexGrow: 9 }]}>시간</Text>
              {userState.role === 'MEMBER' ? (
                <Pressable
                  style={[
                    globalStyle.appbarBtn,
                    globalStyle.buttonGrey,
                    globalStyle.center,
                    styles.editWidth,
                  ]}
                  onPress={(userData) => {
                    navigation.navigate('AddMealPlan', {
                      mode: 'edit',
                      dateValue: dateValue,
                      mealId: mealId,
                    })
                  }}
                >
                  <Text style={globalStyle.appbarBtnText}>수정</Text>
                </Pressable>
              ) : null}
            </View>
            <Text style={[{ marginTop: 5, marginBottom: 5 }]}>
              {getTimeOfDate(infoData.timestamp)}
            </Text>
            <Text style={[globalStyle.heading2, styles.flexGrowWidth]}>분류</Text>

            <Text style={[{ marginTop: 5, marginBottom: 5 }]}>
              {infoData.type === 'BREAKFAST'
                ? '아침'
                : infoData.type === 'LUNCH'
                ? '점심'
                : infoData.type === 'DINNER'
                ? '저녁'
                : infoData.type === 'SNACK'
                ? '간식'
                : '야식'}
            </Text>
            <Text style={{ ...globalStyle.heading2 }}>식단</Text>
            <Text style={[{ marginTop: 5, marginBottom: 5 }]}>{infoData.description}</Text>
            <Text style={{ ...globalStyle.heading2 }}>점수</Text>
            <View style={[globalStyle.row, { marginTop: 5, marginBottom: 5 }]}>
              <Image
                source={
                  infoData.score === 'GOOD' ? happy : infoData.score === 'SOSO' ? Netural : Sad
                }
              />
              <Text>{infoData.score}</Text>
            </View>
          </View>

          <View
            style={{
              paddingLeft: 20,
              paddingTop: 20,
              paddingBottom: 20,
              marginTop: 12,
              backgroundColor: '#FFF',
            }}
          >
            <View style={[{ flexDirection: 'row', paddingRight: 20 }]}>
              <Text style={{ ...globalStyle.heading2, flexGrow: 10 }}>코멘트</Text>
              {delStatus === false ? (
                <Pressable
                  style={[
                    globalStyle.appbarBtn,
                    globalStyle.buttonGrey,
                    globalStyle.center,
                    styles.editWidth,
                  ]}
                  onPress={(userData) => {
                    setDelStatus(true)
                  }}
                >
                  <Text style={globalStyle.appbarBtnText}>수정</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    globalStyle.appbarBtn,
                    globalStyle.buttonGrey,
                    globalStyle.center,
                    styles.editWidth,
                  ]}
                  onPress={(userData) => {
                    setDelStatus(false)
                  }}
                >
                  <Text style={globalStyle.appbarBtnText}>완료</Text>
                </Pressable>
              )}
            </View>

            {comment.length === 0 ? (
              <Text style={styles.noComment}>코멘트가 없습니다.</Text>
            ) : (
              comment.map((item) => {
                return (
                  <View style={[styles.Comment, { flexDirection: 'row' }]}>
                    <View style={[styles.mainFormUser]}>
                      <Image
                        source={
                          item.user.profileImage.path === undefined
                            ? emptyProfile
                            : { uri: item.user.profileImage.path }
                        }
                        style={styles.userImg}
                      />
                    </View>
                    <View style={{ flexGrow: 10, marginTop: 10, marginBottom: 10 }}>
                      <Text style={globalStyle.textDimmedGrey}>{item.user.name}</Text>
                      <Text>{item.comment}</Text>
                      <Text style={globalStyle.textDimmedGrey}>{item.timestamp}</Text>
                    </View>

                    {delStatus === true &&
                    item.user.type.toUpperCase() === userState.role.toUpperCase() ? (
                      <Pressable
                        style={{
                          backgroundColor: '#DD0101',
                          paddingLeft: 10,
                          paddingRight: 10,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          DelMealComment(item.id)
                        }}
                      >
                        <Text
                          style={{ color: '#fff', textAlign: 'center', justifyContent: 'center' }}
                        >
                          삭제
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                )
              })
            )}
          </View>
          <View
            style={[
              globalStyle.row,
              {
                padding: 20,
                backgroundColor: '#FFF',
                borderTopColor: '#eee',
                borderTopWidth: 2,
                alignItems: 'center',
              },
            ]}
          >
            <View style={{ flexGrow: 10 }}>
              <TextInput
                style={[
                  {
                    height: 55,
                    paddingLeft: 10,
                    fontSize: 14,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#C2C7CC',
                    borderRadius: 6,
                  },
                ]}
                onChangeText={setInput}
                value={input}
                placeholder={'입력된 텍스트'}
              />
            </View>

            <Pressable
              style={[
                globalStyle.appbarBtn,
                globalStyle.buttonGrey,
                globalStyle.center,
                styles.editWidth,
                { height: 55, flexGrow: 1 },
              ]}
              onPress={() => {
                PostAddMealComment()
              }}
            >
              <Text style={[globalStyle.appbarBtnText, { fontWeight: 'bold' }]}>입력</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  profile: {
    marginRight: 10,
    width: 92,
    height: 92,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  introHeader: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  noComment: {
    margin: 35,
    textAlign: 'center',
    ...globalStyle.textDimmedGrey,
  },
  Comment: {
    marginRight: 0,
    marginLeft: 5,
    marginBottom: 1,
    textAlign: 'center',
    ...globalStyle.textDimmedGrey,
  },
  editWidth: {
    height: 40,
    width: 60,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin_right: {
    marginRight: 10,
  },
  flexGrowWidth: {
    flexGrow: 1,
  },
  userImg: {
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  mainFormUser: {
    backgroundColor: '#ffff',
  },
})
