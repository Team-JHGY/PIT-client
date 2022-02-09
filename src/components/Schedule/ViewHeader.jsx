// libraries
import React from 'react'
import { Text, StyleSheet, View, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../../utils/globalStyle'
import { getCalendarMonth } from '../../utils/commonFunctions'

import questionMark from '../../../assets/img/Schedule/questionMark.svg'
const ViewHeader = ({ navigation, firstDayOfWeek, lastDayOfWeek, routeMsg }) => {
  var startDate = new Date(firstDayOfWeek)
  var endDate = new Date(lastDayOfWeek)
  const ViewHeaderStyle = () => {
    if (routeMsg !== null && routeMsg.type === 'MEMBER') {
      return {
        marginTop: 0,
      }
    } else {
      return {
        marginTop: 50,
      }
    }
  }

  return (
    <View
      style={[
        {
          width: '88.8%',
          marginBottom: 20,
        },
        ViewHeaderStyle(),
      ]}
    >
      <Text style={styles.title}>{`${getCalendarMonth(startDate, endDate)} 스케쥴`}</Text>
      <View style={{ flexDirection: 'row' }}>
        {routeMsg === null && (
          <Text style={styles.subTitle}>나의 스케쥴 현황은 모든 회원에게 공유됩니다.</Text>
        )}
        {routeMsg === null && (
          <Pressable
            onPress={() => {
              navigation.navigate('ScheduleGuide')
            }}
          >
            <WithLocalSvg asset={questionMark} />
          </Pressable>
        )}
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
