import React from 'react'
import { Text, StyleSheet, View, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import questionMark from '../../../assets/img/Schedule/questionMark.svg'
const ViewHeader = ({ navigation }) => {
  return (
    <View
      style={{
        top: '7.5%',
        width: '88.8%',
      }}
    >
      <Text style={styles.title}>7월 스케쥴</Text>
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
