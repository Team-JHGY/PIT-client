import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image, AsyncStorage } from 'react-native'
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

let date1 = new Date()
let date2 = new Date()
date2.setDate(date2.getDate() - 2)
let todayDate = new Date()
let markedDateArray = [
  {
    date: date1,
    dots: [
      {
        color: '#00D98B',
        selectedColor: '#FFFFFF',
      },
    ],
  },
  {
    date: date2,
    dots: [
      {
        color: '#00D98B',
        selectedColor: '#FFFFFF',
      },
    ],
  },
]
export default function Schedule({ navigation, route }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  // route
  let routeMsg = null
  if (route.params !== undefined) {
    routeMsg = route.params
  }

  // states
  const [appBarArray, setAppBarArray] = React.useState([])
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('')
  const [lastDayOfWeek, setLastDayOfWeek] = useState('')
  const [date, setDate] = useState(new Date())

  React.useEffect(() => {
    AsyncStorage.getItem('userAuth', (err, result) => {
      //user_id에 담긴 아이디 불러오기
      //   console.log(result) // result에 담김 //불러온거 출력
    })
  }, [])
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
            title={'양치승 T 수업 스케쥴'}
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
            selectedDate={todayDate}
            onDateSelected={(date) => {
              setDate(new Date(date))
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
            markedDates={markedDateArray}
          />
        </View>
        <Seperator height={'2%'} />
        {routeMsg !== null && routeMsg.type === 'member' ? (
          <ViewBodyForMember selectedDate={date} />
        ) : (
          <ViewBody navigation={navigation} selectedDate={date} />
        )}

        {/* <Text style={styles.disableText}>스케줄</Text>
        <Pressable onPress={() => navigation.navigate('NewMembers')}>
          <Text>스케줄</Text>
        </Pressable> */}
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
