import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import Asterisk from '../../../assets/icon/asterisk.svg'
export default TextField = ({ title, input, height, isMandatory, isMultiLine, setInput }) => {
  const labelTextStyle = (height) => {
    return {
      ...globalStyle.body2,
      justifyContent: 'center',
      height: height,
      marginLeft: 10,
    }
  }
  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>{title}</Text>
        {isMandatory === true && (
          <View style={{ justifyContent: 'center', marginLeft: 5 }}>
            <WithLocalSvg asset={Asterisk}></WithLocalSvg>
          </View>
        )}
      </View>
      <View height={height} style={styles.labelWrapper}>
        <TextInput
          style={labelTextStyle(height)}
          onChangeText={setInput}
          caretHidden={true}
          multiline={isMultiLine === true ? true : false}
        >
          {input}
        </TextInput>
      </View>
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
