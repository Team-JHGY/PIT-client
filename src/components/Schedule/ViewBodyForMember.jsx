import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native'

// utils
import globalStyle from '../../utils/globalStyle'
import { getDayOfWeek, getMonthOfDate, getDayOfDate } from '../../utils/commonFunctions'

// assets
import clock from '../../../assets/img/Schedule/clock.png'

const ViewBodyForMember = ({ selectedDate }) => {
  let strToday =
    getMonthOfDate(selectedDate) +
    '/' +
    getDayOfDate(selectedDate) +
    ' (' +
    getDayOfWeek(selectedDate) +
    ')'

  // dummy data
  const data1 = [
    { id: '1', startTime: '오전 9:00', endTime: '오전 10:00', name: '김회원', numOfLesson: 1 },
  ]

  const data2 = [
    { id: '1', startTime: '오후 1:00', endTime: '오후 2:00' },
    { id: '2', startTime: '오후 3:30', endTime: '오후 4:20' },
    { id: '3', startTime: '오후 6:00', endTime: '오후 11:55' },
  ]

  // states
  const [myLessonInfo, setMyLessonInfo] = useState([])
  const [trainerLessonInfo, setTrainerLessonInfo] = useState([])

  // useEffect
  useEffect(() => {
    let daybeforeYesterday = new Date()
    daybeforeYesterday.setDate(daybeforeYesterday.getDate() - 2)
    if (
      selectedDate.getDate() === new Date().getDate() ||
      selectedDate.getDate() === daybeforeYesterday.getDate()
    ) {
      setMyLessonInfo(data1)
      setTrainerLessonInfo(data2)
    } else {
      setMyLessonInfo([])
      setTrainerLessonInfo([])
    }
  }, [selectedDate])
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
          data={data1}
          renderItem={({ item }) => {
            return (
              <View style={[globalStyle.row, styles.scheduleInfo]}>
                <View>
                  <Image
                    source={{
                      uri: 'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg',
                    }}
                    style={[styles.userImg]}
                  />
                </View>
                <View style={[globalStyle.col_2]}>
                  <Text style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}>
                    {item.startTime} ~ {item.endTime}
                  </Text>

                  <Text
                    style={[globalStyle.body2, styles.textmargin]}
                  >{`${item.name} (${item.numOfLesson}번째 수업)`}</Text>
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
          data={data2}
          renderItem={({ item }) => {
            return (
              <View style={[globalStyle.row, styles.trainerScheduleInfo]}>
                <Image style={styles.clockImg} source={clock} />
                <Text>{`${item.startTime} ~ ${item.endTime}`}</Text>
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
