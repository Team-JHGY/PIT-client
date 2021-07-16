import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import Member from '../../../assets/img/SignUp/member.svg'
import CheckButton from '../../../assets/img/SignUp/checkButton.svg'
import CheckButtonSelected from '../../../assets/img/SignUp/checkButtonSelected.svg'

import globalStyle from '../../utils/globalStyle'
const TrainerCard = ({ isChecked }) => {
  return (
    <View
      style={
        isChecked === true
          ? [styles.cardSelected, styles.card]
          : [styles.cardUnSelected, styles.card]
      }
    >
      <View style={styles.checkWrapper}>
        {isChecked === true ? (
          <WithLocalSvg asset={CheckButtonSelected} width={30} height={30}></WithLocalSvg>
        ) : (
          <WithLocalSvg asset={CheckButton} width={30} height={30}></WithLocalSvg>
        )}
      </View>
      <View style={styles.imageWrapper}>
        <WithLocalSvg asset={Member} height={180} width={300}></WithLocalSvg>
      </View>
      <Text style={globalStyle.heading2}>회원</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderStyle: 'solid',
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
    flex: 1,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#2AFF91',
  },
  cardUnSelected: {
    borderWidth: 1,
    borderColor: '#E1EAF9',
  },
  checkWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginLeft: 14,
    marginTop: 14,
  },
  heading2: {
    ...globalStyle.heading2,
  },
})
export default TrainerCard
