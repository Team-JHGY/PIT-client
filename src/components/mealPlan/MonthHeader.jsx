// libraries
import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

// utils
import globalStyle from '../../utils/globalStyle'
import { getCalendarMonth } from '../../utils/commonFunctions'

export default function MonthHeader({ firstDayOfWeek, lastDayOfWeek }) {
  let startDate = new Date(firstDayOfWeek)
  let endDate = new Date(lastDayOfWeek)

  return (
    <View
      style={{
        width: '88.8%',
        marginBottom: 20,
        marginTop: 20,
      }}
    >
      <Text style={styles.title}>{getCalendarMonth(startDate, endDate)}</Text>
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
