import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import addFloating from '../../../assets/img/Schedule/addFloating.svg'
const ViewBody = ({ navigation }) => {
  return (
    <View style={{ top: '31%', alignSelf: 'stretch', flex: 1 }}>
      <Text style={styles.date}>7/13(화)</Text>
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
    position: 'absolute',
    bottom: '35%',
    right: '5%',
  },
})

export default ViewBody
