import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import * as SplashScreen from 'expo-splash-screen'
import CalendarStrip from '../../utils/CalendarStrip/CalendarStrip'
import { Appbar } from 'react-native-paper'

//components
import ViewHeader from '../../components/Schedule/ViewHeader'
import Seperator from '../../components/Schedule/Seperator'
import ViewBody from '../../components/Schedule/ViewBody'

// assets
import arrow_left from '../../../assets/arrow_left.png'
import ViewBodyForMember from '../../components/Schedule/ViewBodyForMember'

// JWT token
import { UserContext } from '../../store/user'
import config from '../../utils/config'
import { decode } from 'js-base64'


export default function Schedule({ navigation, route }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  // context
  const { userState, userDispatch } = React.useContext(UserContext)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))

  // route
  let routeMsg = null
  if (route.params !== undefined) {
    routeMsg = route.params
  }

  //TODO: firstDayOfWeek, lastDayOfWeek 기본 값 수정
  // states
  const [appBarArray, setAppBarArray] = React.useState([])
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date())
  const [lastDayOfWeek, setLastDayOfWeek] = useState(new Date())
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [markedDates, setMarkedDates] = useState([])
  // 트레이너의 스케쥴이 몇일날에 있는지 조회하기
  async function GetTrainerScheduleDates(token) {

    let userId = routeMsg === null ? userInfo[0].sub : routeMsg.trainerId
    await fetch(
      `${config.BASE_URL}/schedules/days/trainer/${userId}?month=${
        Number(new Date(firstDayOfWeek).getMonth()) + 1
      }&year=${new Date(firstDayOfWeek).getFullYear()}`,
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
          setMarkedDates(
            res.data.days.map((day) => {
              let newObj = {}
              newObj['date'] = new Date(
                new Date(firstDayOfWeek).getFullYear(),
                new Date(firstDayOfWeek).getMonth(),
                day
              )
              newObj['dots'] = [{ color: '#00D98B', selectedColor: '#FFFFFF' }]
              return newObj
            })
          )
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }


  //TODO: 10~11월 이렇게 걸친 경우에도 10월 11월 두 번 조회해서 가져올 수 있도록 하기
  // React.useEffect(() => {
  //   GetTrainerScheduleDates(userState.jwtToken)
  // }, [firstDayOfWeek])
  React.useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      GetTrainerScheduleDates(userState.jwtToken)
    })
    return unsubscribe
  }, [navigation])

  return (
    <>
      {routeMsg !== null && routeMsg.type === 'member' && (
        <Appbar.Header style={[globalStyle.titleAppbar]}>
          <Pressable
            style={[globalStyle.iconSize, globalStyle.absolute]}
            onPress={() => navigation.goBack()}
          >
            <Image source={arrow_left} style={globalStyle.title} />
          </Pressable>
          <Appbar.Content
            title={`${routeMsg.trainerName} T 수업 스케쥴`}
            titleStyle={[globalStyle.header, globalStyle.center]}
          />
        </Appbar.Header>
      )}
      <SafeAreaView style={styles.mainForm} onLayout={onLayoutRootView}>
        <ViewHeader
          navigation={navigation}
          firstDayOfWeek={firstDayOfWeek}
          lastDayOfWeek={lastDayOfWeek}
          routeMsg={routeMsg}
        />
        <Seperator height={'0.15%'} />

        <View style={styles.calendarContainer}>
          <CalendarStrip

            selectedDate={calendarDate}

            onDateSelected={(date) => {
              setCalendarDate(new Date(date))
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
            //markedDates={markedDates}
          />
        </View>
        <Seperator height={'2%'} />
        {routeMsg !== null && routeMsg.type === 'member' ? (
          <ViewBodyForMember selectedDate={calendarDate} trainerId={routeMsg.trainerId} />
        ) : (
          <ViewBody navigation={navigation} selectedDate={calendarDate} />
        )}
      </SafeAreaView>
    </>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainForm: {
    backgroundColor: '#ffff',
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  disableText: {
    ...globalStyle.body2,
    opacity: 0.3,
  },
  calendarContainer: {
    height: '10%',
    alignSelf: 'stretch',
    marginTop: 5,
  },
})
