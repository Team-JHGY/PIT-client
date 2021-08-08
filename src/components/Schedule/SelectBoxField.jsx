import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import Asterisk from '../../../assets/icon/asterisk.svg'
import selectArrow from '../../../assets/img/Schedule/selectArrow.svg'
const SelectBoxField = ({ title, input, clickEvent, isTextAdded, addedText }) => {
  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={{ justifyContent: 'center', marginLeft: 5 }}>
          <WithLocalSvg asset={Asterisk}></WithLocalSvg>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            clickEvent()
          }}
          style={{ flex: 1 }}
        >
          <View style={styles.selectField}>
            <Text>{input}</Text>
            <View style={{ marginLeft: 'auto', marginRight: '6.25%' }}>
              <WithLocalSvg asset={selectArrow} />
            </View>
          </View>
        </Pressable>
        {isTextAdded && <Text style={{ flex: 1 }}>{' 회까지 반복'}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  titleText: {
    ...globalStyle.heading2,
  },
  selectField: {
    height: 65,
    paddingLeft: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C2C7CC',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default SelectBoxField
