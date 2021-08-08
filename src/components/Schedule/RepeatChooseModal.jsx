import { styleSheets } from 'min-document'
import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'

import globalStyle from '../../utils/globalStyle'

import { WithLocalSvg } from 'react-native-svg'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import check from '../../../assets/img/Schedule/check.svg'
import CancelButton from '../Schedule/CancelButton'
import ConfirmButton from '../Schedule/ConfirmButton'

const data = []
for (var i = 1; i <= 20; i++) {
  data.push({ id: i, title: i + '' })
}
const RepeatChooseModal = ({ closeModal, repeatOptionIdx, setRepeatOptionIdx }) => {
  const [options, setOptions] = useState(data)
  const [tempIdx, setTempIdx] = useState(repeatOptionIdx)

  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={globalStyle.heading2}>{'반복 횟수 선택'}</Text>
          <Pressable
            style={styles.closeIcon}
            onPress={() => {
              closeModal()
            }}
          >
            <WithLocalSvg asset={closeIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <FlatList
          style={{ alignSelf: 'stretch', width: '100%' }}
          keyExtractor={(item) => item.id.toString()}
          data={options}
          renderItem={({ item }) => {
            return (
              <View style={styles.optionItem}>
                {tempIdx === item.id ? (
                  <View style={styles.selectedOptionBox}>
                    <WithLocalSvg asset={check} />
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      setTempIdx(item.id)
                    }}
                  >
                    <View style={styles.unSelectedOptionBox}></View>
                  </Pressable>
                )}
                <View>
                  <Text style={styles.optionBoxTitle}>{item.title}</Text>
                </View>
              </View>
            )
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: '15%',
            paddingBottom: '4.54%',
          }}
        >
          <CancelButton clickEvent={closeModal} />
          <ConfirmButton
            closeModal={closeModal}
            setRepeatOptionIdx={setRepeatOptionIdx}
            item={options[tempIdx - 1]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  modalDialog: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    height: '66.6%',
    width: '88.8%',
    alignItems: 'center',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  closeIcon: {
    right: '5%',
    position: 'absolute',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: '7.5%',
    marginTop: 30,
  },
  selectedOptionBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AFF91',
  },
  unSelectedOptionBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: 'solid',
    borderColor: '#C2C7CC',
  },
  optionBoxTitle: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.15,
    ...globalStyle.body1,
  },
})

export default RepeatChooseModal
