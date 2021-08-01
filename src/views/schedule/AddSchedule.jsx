import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

import { Appbar } from 'react-native-paper'
import globalStyle from '../../utils/globalStyle'
import cross from '../../../assets/cross.png'
import Asterisk from '../../../assets/icon/asterisk.svg'

import ButtonLarge from '../../components/Common/ButtonLarge'
import ModalDialog from '../../components/Common/ModalDialog'
import SelectBoxField from '../../components/Schedule/SelectBoxField'
import Chip from '../../components/Schedule/Chip'
import ScheduleChooseModal from '../../components/Schedule/ScheduleChooseModal'

const AddSchedule = ({ navigation }) => {
  const [isModal, setIsModal] = useState(false)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [clickButton, setClickButton] = useState(1)
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          goBackPage={() => {
            navigation.goBack()
          }}
          title={'일정 등록 취소'}
          body={'일정 등록을 취소하고 나가시겠어요?'}
          buttonTitle={'일정 등록 취소하기'}
        />
      )}
      {isScheduleChooseModal && (
        <ScheduleChooseModal
          closeModal={() => {
            setIsScheduleChooseModal(false)
          }}
        />
      )}
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content
          title={'스케쥴 등록'}
          titleStyle={[globalStyle.heading1, globalStyle.center]}
        />

        <Pressable
          style={[globalStyle.header, globalStyle.absoluteRight]}
          onPress={() => setIsModal(true)}
        >
          <Image source={cross} style={globalStyle.title} />
        </Pressable>
      </Appbar.Header>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ width: '88.8%' }}>
          <SelectBoxField
            title={'스케쥴 선택'}
            input={'수업 또는 비수업을 선택해주세요.'}
            clickEvent={() => {
              setIsScheduleChooseModal(true)
            }}
          />
          <SelectBoxField title={'날짜'} input={'2021.07.13 (화)'} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <SelectBoxField title={'시작 시간'} input={'오전 9:00'} />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <SelectBoxField title={'끝 시간'} input={'오전 10:00'} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={{ ...globalStyle.heading2 }}>{'반복 선택'}</Text>
            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
              <WithLocalSvg asset={Asterisk}></WithLocalSvg>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Chip
              title={'없음'}
              isFirst={true}
              isFocus={clickButton === 1 ? true : false}
              clickEvent={() => setClickButton(1)}
            />
            <Chip
              title={'매일'}
              isFirst={false}
              isFocus={clickButton === 2 ? true : false}
              clickEvent={() => setClickButton(2)}
            />
            <Chip
              title={'매주'}
              isFirst={false}
              isFocus={clickButton === 3 ? true : false}
              clickEvent={() => setClickButton(3)}
            />
          </View>
        </View>
        <ButtonLarge name={'등록'} isEnable={false} />
      </View>
    </SafeAreaView>
  )
}

export default AddSchedule
