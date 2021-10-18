import React, { useCallback } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image, ScrollView, Pressable } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { Appbar } from 'react-native-paper'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../utils/globalStyle'

// assets
import trainer from '../../assets/img/SignUp/trainer.svg'
import calendar from '../../assets/img/Schedule/calendar.png'
import goal from '../../assets/img/Schedule/goal.png'
import report from '../../assets/img/Schedule/report.png'
import emptyProfile from '../../assets/img/SignUp/emptyProfile.png'

// components
import ScheduleActionItem from '../components/Schedule/ScheduleActionItem'

// context
import { UserContext } from '../store/user'

export default function MainView({ navigation, route }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  const { userState, userDispatch } = React.useContext(UserContext)

  // route
  let routeMsg = null
  let memberProfilePath = null
  if (route.params !== undefined) {
    routeMsg = route.params
    if (routeMsg.memberInfo.member.user.profileImage !== null)
      memberProfilePath = routeMsg.memberInfo.member.user.profileImage.path
  }
  if (memberProfilePath === null) {
    memberProfilePath = emptyProfile
  }

  return (
    <SafeAreaView style={styles.body} onLayout={onLayoutRootView}>
      <View style={{ width: '88.8%', marginTop: 30, flex: 1 }}>
        <View style={[globalStyle.row, styles.appBar]}>
          {userState.role === 'member' ? (
            <Image
              style={[styles.userImg]}
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
                      uri: memberProfilePath,
                    }
                  : memberProfilePath
              }
            />
          )}
          {userState.role === 'member' ? (
            <Text>{userState.name}</Text>
          ) : (
            <Text>{routeMsg.memberInfo.member.user.name}</Text>
          )}
        </View>
        <WithLocalSvg style={styles.svgImage} asset={trainer} width={130} height={130} />
        <Text style={[globalStyle.heading1, { marginTop: 5 }]}>
          {userState.role === 'member'
            ? `${userState.name}회원님 안녕하세요\n오늘도 화이팅!`
            : `${routeMsg.memberInfo.member.user.name}회원님 안녕하세요\n오늘도 화이팅!`}
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
          <ScheduleActionItem
            image={goal}
            text={'PT 목표'}
            clickEvent={() => {
              navigation.navigate('PTGoal', { role: userState.role })
            }}
          />
          <ScheduleActionItem image={report} text={'레포트'} />
        </View>
        <Text style={[globalStyle.heading2, { marginTop: 20 }]}>{'다음 수업'}</Text>
        <View style={styles.lesson}>
          <Pressable
            onPress={() => {
              navigation.navigate('ScheduleDetailInfo', { type: 'noUpdate' })
            }}
          >
            <Text style={styles.numOfLesson}>{'10회차'}</Text>
            <Text style={styles.lessonTime}>{'6/21(월) 오후 5:00'}</Text>
          </Pressable>
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
