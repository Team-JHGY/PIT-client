import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import { getDayOfWeek, getMonthOfDate, getDayOfDate } from '../../utils/commonFunctions'
import addFloating from '../../../assets/img/Schedule/addFloating.svg'
const ViewBody = ({ navigation, selectedDate }) => {
  var strToday =
    getMonthOfDate(selectedDate) +
    '/' +
    getDayOfDate(selectedDate) +
    ' (' +
    getDayOfWeek(selectedDate) +
    ')'
  return (
    <View style={{ marginBottom: 20, alignSelf: 'stretch', flex: 1 }}>
      <Text style={styles.date}>{strToday}</Text>
      <Text style={styles.placeholder}>등록된 스케쥴이 없습니다.</Text>
      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate('AddSchedule')
        }}
      >
        <WithLocalSvg asset={addFloating} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  date: {
    ...globalStyle.body1,
    left: '5.6%',
  },
  placeholder: {
    ...globalStyle.body2,
    marginTop: '10%',
    color: '#A6ACB2',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 30,
  },
})

export default ViewBody
