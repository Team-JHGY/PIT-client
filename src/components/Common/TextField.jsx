import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import Asterisk from '../../../assets/icon/asterisk.svg'

const TextField = ({ title, input, height, isMandatory, isMultiLine, setInput, placeholder }) => {
  
  const labelTextStyle = (height) => {
    if (isMultiLine === true) {
      return {
        height: height,
        paddingTop: 10,
      }
    } else {
      return {
        height: height,
      }
    }
  }

  return (
    <View>
      <View style={styles.titleWrapper}>
        {title === null?
          null
          :
          <Text style={styles.titleText}>{title}</Text>
        }
        {isMandatory === true && (
          title === null?
            null:
          <View style={{ justifyContent: 'center', marginLeft: 5 }}>
           <WithLocalSvg asset={Asterisk}></WithLocalSvg>
          </View>
          
        )}
      </View>
      <TextInput
        style={[
          labelTextStyle(height),
          {
            paddingLeft: 10,
            fontSize: 14,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#C2C7CC',
            borderRadius: 6,
          },
        ]}
        onChangeText={setInput}
        value={input}
        multiline={isMultiLine === true ? true : false}
        placeholder={placeholder !== null ? placeholder : ''}
      ></TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
  },
  titleText: {
    ...globalStyle.heading2,
  },
  labelWrapper: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C2C7CC',
    borderRadius: 6,
  },
})

export default TextField
