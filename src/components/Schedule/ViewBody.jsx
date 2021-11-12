import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../../utils/globalStyle'
import {
  getDayOfWeek,
  getMonthOfDate,
  getDayOfDate,
  getTimeOfDate,
} from '../../utils/commonFunctions'

// JWT token
import { UserContext } from '../../store/user'
import config from '../../utils/config'
import { decode } from 'js-base64'

// assets
import addFloating from '../../../assets/img/Schedule/addFloating.svg'

const ViewBody = ({ navigation, selectedDate }) => {
  const [lessonsInfo, setLessonsInfo] = useState([])
  const { userState, userDispatch } = React.useContext(UserContext)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))

  let strToday =
    getMonthOfDate(selectedDate) +
    '/' +
    getDayOfDate(selectedDate) +
    ' (' +
    getDayOfWeek(selectedDate) +
    ')'
  React.useEffect(() => {
    GetMonthTrainerSchedule(userState.jwtToken)
  }, [])

  useEffect(() => {
    // dummy
    let daybeforeYesterday = new Date()
    daybeforeYesterday.setDate(daybeforeYesterday.getDate() - 2)

    if (
      selectedDate.getDate() === new Date().getDate() ||
      selectedDate.getDate() === daybeforeYesterday.getDate()
    ) {
      setLessonsInfo([])
    } else {
      setLessonsInfo([])
    }

    GetMonthTrainerSchedule(userState.jwtToken)
  }, [selectedDate])

  //해당 날짜 데이터 가져오기
  async function GetMonthTrainerSchedule(token) {
    await fetch(
      `${config.BASE_URL}/schedules/trainer/${userInfo[0].sub}?day=${new Date(
        selectedDate
      ).getDate()}&month=${Number(new Date(selectedDate).getMonth()) + 1}&year=${new Date(
        selectedDate
      ).getFullYear()}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          setLessonsInfo(res.data)
          console.log('스케줄 : ', res)
          console.log('스케줄 : ', res.data)
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  // 트레이너의 스케쥴이 몇일날에 있는지 조회하기
  async function GetTrainerScheduleDates(token) {
    await fetch(
      `${config.BASE_URL}/schedules/day/${userInfo[0].sub}?day=${new Date(
        selectedDate
      ).getDate()}&month=${Number(new Date(selectedDate).getMonth()) + 1}&year=${new Date(
        selectedDate
      ).getFullYear()}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          setLessonsInfo(res.data)
          console.log('스케줄 : ', res)
          console.log('스케줄 : ', res.data)
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetMonthTrainerSchedule(userState.jwtToken)
    })
    return unsubscribe
  }, [navigation])

  return (
    <View style={{ marginBottom: 20, alignSelf: 'stretch', flex: 1, flexGrow: 1 }}>
      <Text style={styles.date}>{strToday}</Text>
      {lessonsInfo.length === 0 ? (
        <Text style={styles.placeholder}>등록된 스케쥴이 없습니다.</Text>
      ) : (
        <FlatList
          keyExtractor={(item) => item.id}
          data={lessonsInfo}
          renderItem={({ item }) => {
            return (
              <View>
                <Pressable
                  onPress={() => {
                    if (item.numOfLesson !== null) {
                      navigation.navigate('ScheduleDetailInfo', { type: 'reserved', id: item.id })
                    } else {
                      navigation.navigate('ScheduleDetailInfo', {
                        type: 'notAvailable',
                        id: item.id,
                      })
                    }
                  }}
                >
                  {item.numOfLesson !== null ? (
                    <View style={[globalStyle.row, styles.scheduleInfo]}>
                      <View>
                        {item.partnership.member.user.profileImage === null ? (
                          <Image
                            style={[styles.userImg]}
                            source={require('../../../assets/img/SignUp/emptyProfile.png')}
                          />
                        ) : (
                          <Image
                            source={{ uri: `${item.partnership.member.user.profileImage.path}` }}
                            style={[styles.userImg]}
                          />
                        )}
                      </View>
                      <View style={[globalStyle.col_2]}>
                        <Text
                          style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}
                        >
                          {getTimeOfDate(new Date(item.startAt))}~
                          {getTimeOfDate(new Date(item.endAt))}
                        </Text>

                        <Text
                          style={[globalStyle.body2, styles.textmargin]}
                        >{`${item.partnership.member.user.name} (${item.sequence}번째 수업)`}</Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[globalStyle.row, styles.scheduleInfo, { backgroundColor: '#F5F5F5' }]}
                    >
                      <View style={[globalStyle.col_2]}>
                        <Text
                          style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}
                        >
                          {new Date(item.startAt).getHours > 12
                            ? '오전' +
                              new Date(item.startAt).getHours() +
                              ':' +
                              new Date(item.startAt).getMinutes()
                            : '오후' +
                              new Date(item.startAt)
                                .setHours(new Date(item.startAt).getHours() - 12)
                                .getHours() +
                              ':' +
                              new Date(item.startAt).getMinutes()}
                          ~
                          {new Date(item.endAt).getHours > 12
                            ? '오전' +
                              new Date(item.endAt).getHours() +
                              ':' +
                              new Date(item.endAt).getMinutes()
                            : '오후' +
                              new Date(item.endAt)
                                .setHours(new Date(item.endAt).getHours() - 12)
                                .getHours() +
                              ':' +
                              new Date(item.endAt).getMinutes()}
                        </Text>

                        <Text style={[globalStyle.body2, styles.textmargin]}>{`${item.name}`}</Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>
            )
          }}
        />
      )}

      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate('AddSchedule', { mode: 'create' })
        }}
      >
        <WithLocalSvg asset={addFloating} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  date: {
    ...globalStyle.body1,
    left: '5.6%',
  },
  placeholder: {
    ...globalStyle.body2,
    marginTop: '10%',
    color: '#A6ACB2',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  scheduleInfo: {
    height: 70,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  textmargin: {
    lineHeight: 22,
  },
})

export default ViewBody
