import React, { useEffect, useState } from 'react'
import StyleSheet from 'react-native'

// context
import { UserContext } from '../store/user'

//api
import { getNextLessonInfo } from '../../api/Schedule/schedule-api'

export function Lesson({ navigation }) {
  const { userState, userDispatch } = React.useContext(UserContext)
  const [nextLessonInfo, setNextLessonInfo] = useState(null)
  useEffect(() => {
    let res = getNextLessonInfo()
  }, [])
  return (
    <View style={styles.lesson}>
      {/* <Pressable
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
      </Pressable> */}
    </View>
  )
}

const styles = StyleSheet.style({
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
})
