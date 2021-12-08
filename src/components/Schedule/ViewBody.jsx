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

  useEffect(() => {
    GetMonthTrainerSchedule(userState.jwtToken)
  }, [selectedDate])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetMonthTrainerSchedule(userState.jwtToken)
    })
    return unsubscribe
  }, [navigation,selectedDate])
  
  //해당 날짜 데이터 가져오기
  async function GetMonthTrainerSchedule(token) {
    const dayPicker = JSON.stringify(new Date(selectedDate)).split("T")[0].replace(/"/, "").split("-")

    await fetch(
      `${config.BASE_URL}/schedules/trainer/${userInfo[0].sub}?day=${dayPicker[2]}&month=${dayPicker[1]}&year=${dayPicker[0]}`,
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
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  //TODO : 비수업시간에 대한 코드가 나오면 item.sequence -1 에대한 값을 수정해야한다.
  //TODO : sequence 에 대한 데이터를 마지막에 넣어달라고 요청해야 한다.
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
                  {item.sequence !== -1 ? (
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
                          {getTimeOfDate(item.startAt)}
                          ~
                          {getTimeOfDate(item.endAt)}
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
                          {getTimeOfDate(new Date(item.startAt))} ~ 
                          {getTimeOfDate(new Date(item.endAt))}
                        </Text>

                        <Text style={[globalStyle.body2, styles.textmargin]}>{`비수업 시간`}</Text>
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
