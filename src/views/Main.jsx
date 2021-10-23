import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image, ScrollView, Pressable } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { Appbar } from 'react-native-paper'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../utils/globalStyle'
import { decode } from 'js-base64'
import config from '../utils/config'

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
  const [trainerProfile, setTrainerProfile] = useState('')
  const [trainerName, setTrainerName] = useState('')
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = JSON.parse(decode(splitJwt[1]))

  // route
  let routeMsg = null
  let memberProfilePath = emptyProfile
  if (route.params !== undefined) {
    routeMsg = route.params
    if (routeMsg.memberInfo.member.user.profileImage !== null)
      memberProfilePath = routeMsg.memberInfo.member.user.profileImage.path
  }

  let getActivatedTrainerInfo = async () => {
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
        console.log(res)
        if (res.code === 0) {
          let activatedTrainerInfo = res.data.trainers.find((v, i) => {
            if (v.isEnabled === true) return true
          })
          setTrainerProfile(activatedTrainerInfo.trainer.user.profileImage.path)
          setTrainerName(activatedTrainerInfo.trainer.user.name)
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userState.role === 'member') getActivatedTrainerInfo()
    })
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView style={styles.body} onLayout={onLayoutRootView}>
      <View style={{ width: '88.8%', marginTop: 30, flex: 1 }}>
        <View style={[globalStyle.row, styles.appBar]}>
          {userState.role === 'member' ? (
            <Image
              style={[styles.userImg]}
              source={
                trainerProfile !== ''
                  ? {
                      uri: trainerProfile,
                    }
                  : emptyProfile
              }
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
            <Text>{trainerName}</Text>
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
