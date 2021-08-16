import React, { useCallback } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { Appbar } from 'react-native-paper'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../utils/globalStyle'

// assets
import trainer from '../../assets/img/SignUp/trainer.svg'
import calendar from '../../assets/img/Schedule/calendar.png'
import goal from '../../assets/img/Schedule/goal.png'

// components
import ScheduleActionItem from '../components/Schedule/ScheduleActionItem'

export default function MainView({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  return (
    <SafeAreaView style={styles.body} onLayout={onLayoutRootView}>
      <View style={{ width: '88.8%', marginTop: 30, flex: 1 }}>
        <View style={[globalStyle.row, styles.appBar]}>
          <Image
            style={styles.userImg}
            source={{
              uri: 'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg',
            }}
          />
          <Text>양치승 T</Text>
        </View>
        <WithLocalSvg style={styles.svgImage} asset={trainer} width={130} height={130} />
        <Text style={[globalStyle.heading1, { marginTop: 5 }]}>
          {'이재린 회원님 안녕하세요\n오늘도 화이팅!'}
        </Text>
        <View
          style={[
            globalStyle.row,
            { height: '12.5%', marginTop: 30, justifyContent: 'space-between' },
          ]}
        >
          <ScheduleActionItem
            image={calendar}
            text={'수업 스케쥴'}
            clickEvent={() => {
              navigation.navigate('Schedule', { type: 'member' })
            }}
          />
          <ScheduleActionItem image={goal} text={'PT 목표'} />
          <ScheduleActionItem text={'레포트'} />
        </View>
        <Text style={[globalStyle.heading2, { marginTop: 20 }]}>{'다음 수업'}</Text>
        <View style={styles.lesson}>
          <Text style={styles.numOfLesson}>{'10회차'}</Text>
          <Text style={styles.lessonTime}>{'6/21(월) 오후 5:00'}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  appBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  appBarText: {
    ...globalStyle.body2,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 28,
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E101FF',
    resizeMode: 'cover',
    marginRight: 12,
  },
  svgImage: {
    marginTop: 20,
  },
  lesson: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '11.8%',
    paddingLeft: '6.25%',
  },
  numOfLesson: {
    color: '#00D98B',
    ...globalStyle.body2,
    lineHeight: 20,
    marginTop: 20,
  },
  lessonTime: {
    ...globalStyle.bodt2,
    lineHeight: 20,
    marginTop: 5,
  },
})
