import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../../utils/globalStyle'
import { getDayOfWeek, getMonthOfDate, getDayOfDate } from '../../utils/commonFunctions'

// assets
import addFloating from '../../../assets/img/Schedule/addFloating.svg'

const ViewBody = ({ navigation, selectedDate }) => {
  let strToday =
    getMonthOfDate(selectedDate) +
    '/' +
    getDayOfDate(selectedDate) +
    ' (' +
    getDayOfWeek(selectedDate) +
    ')'
  const [lessonsInfo, setLessonsInfo] = useState([])

  const data = [
    { id: '1', startTime: '오전 9:00', endTime: '오전 10:00', name: '김회원', numOfLesson: 1 },
    { id: '2', startTime: '오후 1:00', endTime: '오후 2:00', name: '정dddd회원', numOfLesson: 5 },
    { id: '3', startTime: '오후 3:30', endTime: '오후 4:20', name: '박회원', numOfLesson: 1 },
    {
      id: '4',
      startTime: '오후 6:00',
      endTime: '오후 11:55',
      name: '비수업시간',
      numOfLesson: null,
    },
  ]
  useEffect(() => {
    // dummy

    let daybeforeYesterday = new Date()
    daybeforeYesterday.setDate(daybeforeYesterday.getDate() - 2)
    if (
      selectedDate.getDate() === new Date().getDate() ||
      selectedDate.getDate() === daybeforeYesterday.getDate()
    ) {
      setLessonsInfo(data)
    } else {
      setLessonsInfo([])
    }
  }, [selectedDate])
  return (
    <View style={{ marginBottom: 20, alignSelf: 'stretch', flex: 1 ,  flexGrow: 1}}>
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
                      navigation.navigate('ScheduleDetailInfo', { type: 'reserved' })
                    } else {
                      navigation.navigate('ScheduleDetailInfo', { type: 'notAvailable' })
                    }
                  }}
                >
                  {item.numOfLesson !== null ? (
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
                        <Text
                          style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}
                        >
                          {item.startTime} ~ {item.endTime}
                        </Text>

                        <Text
                          style={[globalStyle.body2, styles.textmargin]}
                        >{`${item.name} (${item.numOfLesson}번째 수업)`}</Text>
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
                          {item.startTime} ~ {item.endTime}
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
    alignSelf:'flex-end',

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
