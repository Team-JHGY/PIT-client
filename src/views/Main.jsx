import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Image, Pressable } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'


import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../utils/globalStyle'
import { decode } from 'js-base64'
import config from '../utils/config'
import { getDayOfWeek, getMonthOfDate, getDayOfDate, getTimeOfDate } from '../utils/commonFunctions'

// assets
import trainer from '../../assets/img/SignUp/trainer.svg'
import calendar from '../../assets/img/Schedule/calendar.png'
import goal from '../../assets/img/Schedule/goal.png'

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
  const [trainerProfile, setTrainerProfile] = useState(emptyProfile)
  const [trainerName, setTrainerName] = useState('')
  const [trainerId, setTrainerId] = useState(null)
  const [partnershipId, setPartnershipId] = useState(null)
  const [nextLessonInfo, setNextLessonInfo] = useState('')
  const [nextLessonSequence, setNextLessonSequence] = useState(null)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = JSON.parse(decode(splitJwt[1]))
  // route
  let routeMsg = null
  let memberProfile = emptyProfile
  if (route.params !== undefined) {
    routeMsg = route.params
    if (routeMsg.memberInfo.member.user.profileImage !== null)
      memberProfile = routeMsg.memberInfo.member.user.profileImage.path
  }

  React.useEffect(()=>{
    if (userState.role === 'member'){
      getActivatedTrainerInfo()
    }
  },[])

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
        if (res.code === 0) {
          let activatedTrainerInfo = res.data.trainers.find((v, i) => {
            if (v.isEnabled === true) return true
          })

          setTrainerId(activatedTrainerInfo.trainer.user.id)
          setTrainerProfile(activatedTrainerInfo.trainer.user.profileImage.path)
          setTrainerName(activatedTrainerInfo.trainer.user.name)
          setPartnershipId(activatedTrainerInfo.partnershipId)
          
        }
      })
      .catch((e) => console.log(e))
  }

  let getNextLessonInfo = async () => {
    let url
    if (userState.role === 'member') {
      url = `${config.BASE_URL}/schedules/next/member/${userInfo.sub}`
    } else if (userState.role === 'trainer') {
      url = `${config.BASE_URL}/schedules/next/member/${routeMsg.memberInfo.member.id}`
    }

    await fetch(url, {
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
        //console.log(res)
        if (res.code === 0) {
          let startAtDate = new Date(res.data.startAt)
          let endAtDate = new Date(res.data.endAt)

          setNextLessonInfo(
            `${getMonthOfDate(startAtDate)}/${getDayOfDate(startAtDate)}(${getDayOfWeek(
              startAtDate
            )}) ${getTimeOfDate(startAtDate)} ~ ${getTimeOfDate(endAtDate)}`
          )
          setNextLessonSequence(res.data.sequence)
        } else if (res.code === -13) {
          setNextLessonInfo('다음 수업 정보가 없습니다.')
        }
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userState.role === 'member') getActivatedTrainerInfo()
      if (userState.role === 'trainer') {
        setPartnershipId(routeMsg.memberInfo.partnershipId)
      }
      getNextLessonInfo()
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
                trainerProfile !== emptyProfile
                  ? {
                      uri: trainerProfile,
                    }
                  : trainerProfile
              }
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
              if (userState.role === 'member') {
                navigation.navigate('Schedule', {
                  type: userState.role,
                  trainerName: trainerName,
                  trainerId: trainerId,
                })
              } else if (userState.role === 'trainer') {
                navigation.navigate('Schedule', { type: userState.role })
              }
            }}
          />
          <ScheduleActionItem
            image={goal}
            text={'PT 목표'}
            clickEvent={() => {
              if (userState.role === 'member') {
                navigation.navigate('PTGoal', {
                  memberName: userState.name,
                  trainerName: trainerName,
                  memberProfile: userState.profile,
                  trainerProfile: trainerProfile,
                  partnershipId: partnershipId,
                })
              } else {
                navigation.navigate('PTGoal', {
                  memberName: routeMsg.memberInfo.member.user.name,
                  trainerName: userState.name,
                  memberProfile: memberProfile,
                  trainerProfile: userState.profile,
                  partnershipId: partnershipId,
                })
              }
            }}
          />
          
        </View>
        <Text style={[globalStyle.heading2, { marginTop: 20 }]}>{'다음 수업'}</Text>
        <View style={styles.lesson}>
          <Pressable
            onPress={() => {
              navigation.navigate('ScheduleDetailInfo', { type: 'noUpdate' })
            }}
          >
            <Text style={styles.numOfLesson}>
              {nextLessonSequence === null
                ? '다음 회차 정보가 없습니다. '
                : `${nextLessonSequence}회차`}
            </Text>
            <Text style={styles.lessonTime}>{nextLessonInfo}</Text>
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
  icons: {
    marginTop:10,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 24,
    height: 24,
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
    height: '15%',
    paddingLeft: '6.25%',
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
  },
})
