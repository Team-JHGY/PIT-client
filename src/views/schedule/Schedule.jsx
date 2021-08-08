import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, AsyncStorage } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import * as SplashScreen from 'expo-splash-screen'
import CalendarStrip from '../../utils/CalendarStrip/CalendarStrip'

//components
import ViewHeader from '../../components/Schedule/ViewHeader'
import Seperator from '../../components/Schedule/Seperator'
import ViewBody from '../../components/Schedule/ViewBody'
export default function Schedule({ navigation }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })
  const [appBarArray, setAppBarArray] = React.useState([])

  const [firstDayOfWeek, setFirstDayOfWeek] = useState('')
  const [lastDayOfWeek, setLastDayOfWeek] = useState('')
  const [date, setDate] = useState(new Date())
  React.useEffect(() => {
    AsyncStorage.getItem('userAuth', (err, result) => {
      //user_id에 담긴 아이디 불러오기
      console.log(result) // result에 담김 //불러온거 출력
    })
  }, [])

  return (
    <SafeAreaView style={styles.mainForm} onLayout={onLayoutRootView}>
      <ViewHeader
        navigation={navigation}
        firstDayOfWeek={firstDayOfWeek}
        lastDayOfWeek={lastDayOfWeek}
      />
      <View style={styles.calendarContainer}>
        <CalendarStrip
          selectedDate={new Date()}
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
        />
      </View>
      <Seperator />
      <ViewBody navigation={navigation} selectedDate={date} />
      {/* <Text style={styles.disableText}>스케줄</Text>
        <Pressable onPress={() => navigation.navigate('NewMembers')}>
          <Text>스케줄</Text>
        </Pressable> */}
    </SafeAreaView>
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
    marginTop: 15,
  },
})
