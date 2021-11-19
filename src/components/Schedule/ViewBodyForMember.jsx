import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native'

// utils
import globalStyle from '../../utils/globalStyle'
import { getDayOfWeek, getMonthOfDate, getDayOfDate } from '../../utils/commonFunctions'
import config from '../../utils/config'
import { getTimeOfDate } from '../../utils/commonFunctions'

// context
import { UserContext } from '../../store/user'
import { decode } from 'js-base64'

// assets
import clock from '../../../assets/img/Schedule/clock.png'

const ViewBodyForMember = ({ selectedDate, trainerId }) => {
  let strToday =
    getMonthOfDate(selectedDate) +
    '/' +
    getDayOfDate(selectedDate) +
    ' (' +
    getDayOfWeek(selectedDate) +
    ')'

  // states
  const [myLessonInfo, setMyLessonInfo] = useState([])
  const [trainerLessonInfo, setTrainerLessonInfo] = useState([])
  const { userState, userDispatch } = React.useContext(UserContext)

  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))

  // useEffect
  useEffect(() => {
    GetTrainerSchedule()
  }, [selectedDate])

  //트레이너 해당 날짜 데이터 가져오기
  async function GetTrainerSchedule() {
    await fetch(
      `${config.BASE_URL}/schedules/trainer/${trainerId}?day=${new Date(
        selectedDate
      ).getDate()}&month=${Number(new Date(selectedDate).getMonth()) + 1}&year=${new Date(
        selectedDate
      ).getFullYear()}`,
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
          setTrainerLessonInfo(res.data)

          let isMatch = false
          res.data.map((v) => {
            if (v.partnership.member.id === Number(userInfo[0].sub)) {
              setMyLessonInfo([v])
              isMatch = true
            }
          })
          if (isMatch === false) {
            setMyLessonInfo([])
          }
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  return (
    <View style={{ marginBottom: 20, alignSelf: 'stretch', flex: 1 }}>
      <Text style={styles.title}>{strToday}</Text>
      <Text style={styles.title}>{'내 수업'}</Text>
      {myLessonInfo.length === 0 ? (
        <Text style={styles.placeholder}>등록된 스케쥴이 없습니다.</Text>
      ) : (
        <FlatList
          style={{ flexGrow: 0 }}
          keyExtractor={(item) => item.id}
          data={myLessonInfo}
          renderItem={({ item }) => {
            return (
              <View style={[globalStyle.row, styles.scheduleInfo]}>
                <View>
                  <Image
                    source={{
                      uri: item.partnership.member.user.profileImage.path,
                    }}
                    style={[styles.userImg]}
                  />
                </View>
                <View style={[globalStyle.col_2]}>
                  <Text style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}>
                    {getTimeOfDate(new Date(item.startAt))} ~ {getTimeOfDate(new Date(item.endAt))}
                  </Text>

                  <Text
                    style={[globalStyle.body2, styles.textmargin]}
                  >{`${item.partnership.member.user.name} (${item.sequence}번째 수업)`}</Text>
                </View>
              </View>
            )
          }}
        />
      )}
      <Text style={[styles.title, { marginTop: 40 }]}>{'선생님 스케쥴'}</Text>
      {trainerLessonInfo.length === 0 ? (
        <Text style={[styles.placeholder, { marginTop: 30 }]}>등록된 스케쥴이 없습니다.</Text>
      ) : (
        <FlatList
          keyExtractor={(item) => item.id}
          data={trainerLessonInfo}
          renderItem={({ item }) => {
            return (
              <View style={[globalStyle.row, styles.trainerScheduleInfo]}>
                <Image style={styles.clockImg} source={clock} />
                <Text>{`${getTimeOfDate(new Date(item.startAt))} ~ ${getTimeOfDate(
                  new Date(item.endAt)
                )}`}</Text>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    ...globalStyle.body1,
    left: '5.6%',
  },
  placeholder: {
    ...globalStyle.body2,
    marginTop: 30,
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
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  clockImg: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  trainerScheduleInfo: {
    height: 70,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
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

export default ViewBodyForMember
