import React from 'react'
import { Text, StyleSheet, View, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import questionMark from '../../../assets/img/Schedule/questionMark.svg'
const ViewHeader = ({ navigation, firstDayOfWeek, lastDayOfWeek }) => {
  var startDate = new Date(firstDayOfWeek)
  var endDate = new Date(lastDayOfWeek)

  var getCalendarMonth = (firstDay, lastDay) => {
    if (firstDay.getMonth() === lastDay.getMonth()) return startDate.getMonth() + 1 + '월 스케쥴'
    else return startDate.getMonth() + 1 + '~' + (lastDay.getMonth() + 1) + '월 스케쥴'
  }
  return (
    <View
      style={{
        marginTop: 50,
        width: '88.8%',
      }}
    >
      <Text style={styles.title}>{getCalendarMonth(startDate, endDate)}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.subTitle}>나의 스케쥴 현황은 모든 회원에게 공유됩니다.</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('ScheduleGuide')
          }}
        >
          <WithLocalSvg asset={questionMark} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { ...globalStyle.heading1 },
  subTitle: {
    ...globalStyle.body2,
    fontSize: 14,
    lineHeight: 19,
    color: '#5A5757',
    marginRight: 10,
  },
})
export default ViewHeader
