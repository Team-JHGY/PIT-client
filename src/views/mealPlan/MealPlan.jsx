import React, { useCallback, useEffect, useState } from 'react'

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  AsyncStorage,
} from 'react-native'

import globalStyle from '../../utils/globalStyle'
import * as SplashScreen from 'expo-splash-screen'
import CalendarStrip from '../../utils/CalendarStrip/CalendarStrip'
import { Appbar } from 'react-native-paper'
import { WithLocalSvg } from 'react-native-svg'
// context
import { UserContext } from '../../store/user'
import { decode } from 'js-base64'
import config from '../../utils/config'

//components
import Seperator from '../../components/Schedule/Seperator'
import MonthHeader from '../../components/mealPlan/MonthHeader'

// assets
import arrow_left from '../../../assets/arrow_left.png'
import addFloating from '../../../assets/img/Schedule/addFloating.svg'
import AddMealPhoto from '../../../assets/img/mealPlan/AddMealPhoto.svg'
import happy from '../../../assets/img/mealPlan/happy.png'
import Netural from '../../../assets/img/mealPlan/Netural.png'
import Sad from '../../../assets/img/mealPlan/Sad.png'
import Chat from '../../../assets/img/mealPlan/Chat.svg'
import emptyProfile from '../../../assets/img/SignUp/emptyProfile.png'

// utils
import {
  getDayOfWeek,
  getMonthOfDate,
  getDayOfDate,
  getTimeOfDate,
} from '../../utils/commonFunctions'

// global variables
let today = new Date()

let minDate
let maxDate

minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()

maxDate = new Date(today.getFullYear(), today.getMonth() + 1, lastDayOfMonth)

let whitelistDates = [
  {
    start: minDate,
    end: maxDate,
  },
]

export default function MealPlan({ navigation, route }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  // route
  let routeMsg = null
  let memberProfile = emptyProfile
  if (route.params !== undefined) {
    routeMsg = route.params
    if (routeMsg.memberInfo.member.user.profileImage !== null)
      memberProfile = routeMsg.memberInfo.member.user.profileImage.path
  }

  // states
  const { userState, userDispatch } = React.useContext(UserContext)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = JSON.parse(decode(splitJwt[1]))
  const [partnershipId, setPartnershipId] = useState(null)
  const [lessonInfo, setLessonInfo] = useState('')
  const [markedDates, setMarkedDates] = useState([])

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date())
  const [lastDayOfWeek, setLastDayOfWeek] = useState(new Date())
  const [date, setDate] = useState(new Date())
  const [seleted, setSeleted] = React.useState('meal')
  const [modalVisible, setModalVisible] = useState(false)
  const [mealPanList, setMealPlanList] = React.useState([])

  async function GetMemberScheduleDates() {
    let userId = routeMsg === null ? userInfo.sub : routeMsg.memberInfo.member.id

    await fetch(
      `${config.BASE_URL}/schedules/days/member/${userId}?month=${
        Number(today.getMonth()) + 1
      }&year=${today.getFullYear()}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          let prevMonthDays = res.data.previousMonthDays.days.map((day) => {
            let newObj = {}
            newObj['date'] = new Date(
              res.data.previousMonthDays.year,
              res.data.previousMonthDays.month - 1,
              day
            )
            newObj['dots'] = [{ color: '#00D98B', selectedColor: '#FFFFFF' }]
            return newObj
          })
          let currMonthDays = res.data.days.days.map((day) => {
            let newObj = {}
            newObj['date'] = new Date(res.data.days.year, res.data.days.month - 1, day)
            newObj['dots'] = [{ color: '#00D98B', selectedColor: '#FFFFFF' }]
            return newObj
          })
          let nextMonthDays = res.data.nextMonthDays.days.map((day) => {
            let newObj = {}
            newObj['date'] = new Date(
              res.data.nextMonthDays.year,
              res.data.nextMonthDays.month - 1,
              day
            )
            newObj['dots'] = [{ color: '#00D98B', selectedColor: '#FFFFFF' }]
            return newObj
          })
          setMarkedDates(prevMonthDays.concat(currMonthDays).concat(nextMonthDays))
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  async function GetMealList(id, dateValue) {
    const dateValueForm = new Date(JSON.parse(dateValue))
    console.log('dateValue.getDate', dateValueForm)

    await fetch(
      `${config.BASE_URL}/diet/partnership/${id}?day=${dateValueForm.getDate()}&month=${
        dateValueForm.getMonth() + 1
      }&year=${dateValueForm.getFullYear()}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          setMealPlanList(res.data)
          console.log('식단 조회', res)
        }
      })
  }

  async function GetLessonInfo() {
    //TODO 스케줄 아이디를 먼저 구해야한다.
    let userId = routeMsg === null ? userInfo.sub : routeMsg.memberInfo.member.id
    await fetch(
      `${config.BASE_URL}/schedules/member/${userId}?day=${date.getDate()}&month=${
        date.getMonth() + 1
      }&year=${date.getFullYear()}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: userState.jwtToken,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          setLessonInfo(res.data)
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  async function getActivatedTrainerInfo(dateValue) {
    await fetch(`${config.BASE_URL}/partnerships/${userInfo.sub}/trainers`, {
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
          let activatedTrainerInfo = res.data.trainers.find((v, i) => {
            if (v.isEnabled === true) return true
          })
          setPartnershipId(activatedTrainerInfo.partnershipId)
          GetMealList(activatedTrainerInfo.partnershipId, dateValue)
        }
      })
      .catch((e) => console.log(e))
  }

  React.useEffect(() => {
    if (userState.role === 'MEMBER') {
      AsyncStorage.getItem('date', (err, result) => {
        getActivatedTrainerInfo(result)
      })
    } else {
      GetMealList(route.params.memberInfo.partnershipId, date)
    }
    GetLessonInfo()
    GetMemberScheduleDates()
  }, [date])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userState.role === 'member') {
        AsyncStorage.getItem('date', (err, result) => {
          getActivatedTrainerInfo(result)
        })
      } else {
        GetMealList(route.params.memberInfo.partnershipId, date)
      }
      GetLessonInfo()
      GetMemberScheduleDates()
    })
    return unsubscribe
  }, [navigation])

  return (
    <>
      <SafeAreaView
        style={[styles.mainFormUser, { backgroundColor: '#F5F5F5' }]}
        onLayout={onLayoutRootView}
      >
        <ScrollView>
          <Seperator />

          <View style={styles.calendarContainer}>
            <Appbar.Header style={[styles.appBar]}>
              <View style={[globalStyle.row, styles.headerImg]}>
                <Pressable style={[globalStyle.iconSize]} onPress={() => navigation.goBack()}>
                  <Image source={arrow_left} style={globalStyle.title} />
                </Pressable>
                <View
                  style={[
                    globalStyle.row,
                    styles.appBar,
                    styles.mainFormUser,
                    styles.headerImg,
                    styles.flexBasis,
                  ]}
                >
                  {userState.role === 'MEMBER' ? (
                    <Image
                      style={[styles.userImg, { borderColor: '#11F37E' }]}
                      source={{
                        uri: userState.profile,
                      }}
                    />
                  ) : (
                    <Image
                      style={[styles.userImg, { borderColor: '#11F37E' }]}
                      source={
                        routeMsg.memberInfo.member.user.profileImage !== null
                          ? {
                              uri: memberProfile,
                            }
                          : memberProfile
                      }
                    />
                  )}
                  {userState.role === 'MEMBER' ? (
                    <Text>{userState.name}</Text>
                  ) : (
                    <Text>{routeMsg.memberInfo.member.user.name}</Text>
                  )}
                </View>
              </View>
            </Appbar.Header>
            <View style={{ alignItems: 'center' }}>
              <MonthHeader firstDayOfWeek={firstDayOfWeek} lastDayOfWeek={lastDayOfWeek} />
            </View>
            <CalendarStrip
              selectedDate={date}
              onDateSelected={(date) => {
                console.log(JSON.stringify(date))
                AsyncStorage.setItem('date', JSON.stringify(date))
                setDate(new Date(date))
              }}
              scrollable={true}
              style={{ height: 80, paddingTop: 5, paddingBottom: 10 }}
              dateNumberStyle={{ color: '#000000' }}
              dateNameStyle={{ color: '#A6ACB2' }}
              highlightDateNumberStyle={{ color: '#FFFFFF' }}
              highlightDateNameStyle={{ color: '#FFFFFF' }}
              weekendDateNameStyle={{ color: '#DD0101' }}
              styleWeekend={true}
              highlightDateContainerStyle={{ backgroundColor: '#00D98B' }}
              dayComponentHeight={60}
              setFirstDayOfWeek={setFirstDayOfWeek}
              setLastDayOfWeek={setLastDayOfWeek}
              minDate={minDate}
              maxDate={maxDate}
              datesWhitelist={whitelistDates}
              markedDates={markedDates}
            />
          </View>
          <View style={{ margin: 20 }}>
            <Text style={[styles.subTitle]}>수업</Text>
            {lessonInfo.length > 0 ? (
              <View style={styles.lesson}>
                {lessonInfo.length > 0 && (
                  <Text style={styles.numOfLesson}>{`${lessonInfo[0].sequence}회차`}</Text>
                )}

                <Text style={[styles.lessonTime]}>
                  {`${getMonthOfDate(new Date(lessonInfo[0].startAt))}/${getDayOfDate(
                    new Date(lessonInfo[0].startAt)
                  )}(${getDayOfWeek(lessonInfo[0].startAt)}) ${getTimeOfDate(
                    lessonInfo[0].startAt
                  )} ~ ${getTimeOfDate(lessonInfo[0].endAt)}`}
                </Text>
              </View>
            ) : (
              <View style={styles.nolesson}>
                <Text style={[styles.noMealPlan]}>{'수업 기록이 없습니다.'}</Text>
              </View>
            )}
          </View>

          {/*식단 부분 뷰 */}
          {seleted === 'meal' ? (
            <View style={{ margin: 20 }}>
              <View style={[globalStyle.row, { alignItems: 'stretch' }]}>
                <Text style={[styles.subTitle, { flexGrow: 4 }]}>식단 기록</Text>
              </View>

              {mealPanList.length === 0 ? (
                <Text style={[styles.noMealPlan]}>식단 기록이 없습니다.</Text>
              ) : (
                <ScrollView
                  horizontal={true}
                  style={[styles.MealPlan, globalStyle.row, { paddingRight: 20, paddingLeft: 20 }]}
                >
                  {mealPanList.map((item, index) => {
                    return (
                      <View key={item.time} style={{ marginRight: 10 }}>
                        <Pressable
                          onPress={() =>
                            navigation.navigate('MealCommentPage', {
                              mealId: item.id,
                              dateValue: new Date(date),
                            })
                          }
                        >
                          {item.images.length === 0 ? (
                            <WithLocalSvg asset={AddMealPhoto} />
                          ) : (
                            <Image
                              source={{ uri: item.images[0].path }}
                              style={{ width: 92, height: 92 }}
                            />
                          )}

                          <Text key={item.time + index}>{getTimeOfDate(item.timestamp)}</Text>
                          <View style={[globalStyle.row, { alignItems: 'stretch' }]}>
                            <View style={[globalStyle.row, { flexGrow: 20, alignItems: 'center' }]}>
                              <Image
                                source={
                                  item.score === 'SOSO'
                                    ? Netural
                                    : item.score === 'BAD'
                                    ? Sad
                                    : happy
                                }
                              />
                            </View>
                            <View style={[globalStyle.row, { alignItems: 'center' }]}>
                              <WithLocalSvg asset={Chat} />
                              <Text>{item.commentNumber}</Text>
                            </View>
                          </View>
                        </Pressable>
                      </View>
                    )
                  })}
                  <View style={[{ width: 30 }]}></View>
                </ScrollView>
              )}
            </View>
          ) : null}
          {/*수업 관련 뷰 */}
        </ScrollView>
        {userState.role === 'MEMBER' ? (
          <Pressable
            style={[styles.floatingButton, styles.paddingRight, { elevation: 9999 }]}
            onPress={() => {
              navigation.navigate('AddMealPlan', { mode: 'create', dateValue: new Date(date) })
            }}
          >
            <WithLocalSvg asset={addFloating} />
          </Pressable>
        ) : null}
      </SafeAreaView>
    </>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainFormUser: {
    backgroundColor: '#ffff',
    flex: 1,
  },
  paddingRight: {
    marginRight: 20,
  },
  whiteBtn: {
    color: '#fff',
  },
  appBar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    elevation: 0,
    height: 60,
  },
  bottomoList: {
    flex: 5,
    backgroundColor: 'red',
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 0,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  headerImg: {
    alignItems: 'center',
    alignContent: 'space-between',
    flex: 1,
  },
  flexBasis: {
    flexBasis: 300,
  },
  disableText: {
    ...globalStyle.body2,
    opacity: 0.3,
  },
  calendarContainer: {
    backgroundColor: '#ffff',
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  selectBtnList: {
    alignItems: 'center',
    margin: 'auto',
  },
  allBtnList: {
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: '#E8ECEF',
    marginTop: 16,
    borderRadius: 6,
    //  maxWidth: 320,
  },
  selectBtn: {
    flexGrow: 1,
    flexBasis: 100,
    padding: 10,
    borderRadius: 6,
  },
  selectedBtn: {
    flexGrow: 1,
    flexBasis: 100,
    padding: 10,
    borderRadius: 6,
    ...globalStyle.buttonLightGreen,
  },
  userImg: {
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E101FF',
    resizeMode: 'cover',
    marginRight: 12,
  },
  floatingButton: {
    zIndex: 999,
    position: 'absolute',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 0,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    right: 0,
    bottom: 0,
  },
  floatingButtonOver: {
    flex: 1,
    zIndex: 999,
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noMealPlan: {
    margin: 20,
    textAlign: 'center',
    ...globalStyle.textDimmedGrey,
  },
  MealPlan: {
    padding: 20,
    paddingRight: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  centeredView: {
    paddingBottom: 50,
    paddingRight: 20,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  editWidth: {
    width: 60,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numOfLesson: {
    color: '#00D98B',
    ...globalStyle.body2,
    lineHeight: 20,
    marginTop: 20,
  },
  lessonTime: {
    ...globalStyle.body2,
    lineHeight: 20,
    marginTop: 5,
    color: '#000',
  },
  lesson: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginTop: 20,
    height: 90,
    paddingLeft: '6.25%',
  },
  nolesson: {
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    height: 90,
    paddingLeft: '6.25%',
  },
})
