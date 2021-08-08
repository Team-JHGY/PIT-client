import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Appbar } from 'react-native-paper'

// components
import ButtonLarge from '../../components/Common/ButtonLarge'
import ModalDialog from '../../components/Common/ModalDialog'
import SelectBoxField from '../../components/Schedule/SelectBoxField'
import Chip from '../../components/Schedule/Chip'
import ScheduleChooseModal from '../../components/Schedule/ScheduleChooseModal'
import RepeatChooseModal from '../../components/Schedule/RepeatChooseModal'

// utils
import globalStyle from '../../utils/globalStyle'
import {
  getDayOfWeek,
  getMonthOfDate,
  getDayOfDate,
  getTimeOfDate,
} from '../../utils/commonFunctions'

// assets
import cross from '../../../assets/cross.png'
import Asterisk from '../../../assets/icon/asterisk.svg'

const AddSchedule = ({ navigation }) => {
  const [isModal, setIsModal] = useState(false)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [isRepeatModal, setIsRepeatModal] = useState(false)
  const [clickButton, setClickButton] = useState(1)
  const [member, setMember] = useState('수업 또는 비수업을 선택해주세요.')
  const [memberIdx, setMemberIdx] = useState(1)
  const [repeatOptionIdx, setRepeatOptionIdx] = useState(1)
  // datetimepicker - 날짜
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const showDatepicker = () => {
    setShow(true)
  }

  // datetimepicker - 시작시간
  const [fromTime, setFromTime] = useState(new Date(2021, 9, 4, 9, 0, 0))
  const [showFromTime, setShowFromTime] = useState(false)

  const onFromTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowFromTime(Platform.OS === 'ios')
    if (event.type === 'set') {
      setFromTime(currentDate)
    }
  }

  const showFromTimepicker = () => {
    setShowFromTime(true)
  }

  // datetimepicker - 종료시간
  const [toTime, setToTime] = useState(new Date(2021, 9, 4, 10, 0, 0))
  const [showToTime, setShowToTime] = useState(false)

  const onToTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowToTime(Platform.OS === 'ios')
    if (event.type === 'set') {
      setToTime(currentDate)
    }
  }

  const showToTimepicker = () => {
    setShowToTime(true)
  }

  // 등록버튼
  const [buttonEnable, setButtonEnable] = useState(false)

  useEffect(() => {
    if (member !== '수업 또는 비수업을 선택해주세요.') setButtonEnable(true)
  }, [member])
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
          chooseMember={(member) => setMember(member)}
          memberIdx={memberIdx}
          setMemberIdx={setMemberIdx}
        />
      )}
      {isRepeatModal && (
        <RepeatChooseModal
          closeModal={() => {
            setIsRepeatModal(false)
          }}
          setRepeatOptionIdx={(option) => setRepeatOptionIdx(option)}
          repeatOptionIdx={repeatOptionIdx}
        />
      )}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={false}
          display="spinner"
          onChange={onDateChange}
        />
      )}
      {showFromTime && (
        <DateTimePicker
          testID="fromTimepicker"
          value={fromTime}
          mode={'time'}
          is24Hour={false}
          display="spinner"
          onChange={onFromTimeChange}
        />
      )}
      {showToTime && (
        <DateTimePicker
          testID="toTimepicker"
          value={toTime}
          mode={'time'}
          is24Hour={false}
          display="spinner"
          onChange={onToTimeChange}
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
            input={member}
            clickEvent={() => {
              setIsScheduleChooseModal(true)
            }}
          />
          <SelectBoxField
            title={'날짜'}
            input={
              date.getFullYear() +
              '.' +
              getMonthOfDate(date) +
              '.' +
              getDayOfDate(date) +
              ' (' +
              getDayOfWeek(date) +
              ')'
            }
            clickEvent={showDatepicker}
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <SelectBoxField
                title={'시작 시간'}
                input={getTimeOfDate(fromTime)}
                clickEvent={showFromTimepicker}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <SelectBoxField
                title={'끝 시간'}
                input={getTimeOfDate(toTime)}
                clickEvent={showToTimepicker}
              />
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
          {clickButton !== 1 && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <SelectBoxField
                  title={'반복 횟수 선택'}
                  isTextAdded={true}
                  input={repeatOptionIdx}
                  clickEvent={() => {
                    setIsRepeatModal(true)
                  }}
                />
              </View>
            </View>
          )}
        </View>
        <ButtonLarge name={'등록'} isEnable={buttonEnable} />
      </View>
    </SafeAreaView>
  )
}

export default AddSchedule
