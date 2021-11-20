import React, { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Text, Pressable, Image } from 'react-native'
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

import { decode } from 'js-base64';


// assets
import cross from '../../../assets/cross.png'
import Asterisk from '../../../assets/icon/asterisk.svg'

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config"

const AddSchedule = ({ navigation, route }) => {
  // mode
  const { mode, value } = route.params

  // state
  const { userState, userDispatch }     = React.useContext(UserContext)
  const splitJwt                        = userState.jwtToken.split(".")
  const userInfo                        = React.useState(JSON.parse(decode(splitJwt[1])))

  const [isModal, setIsModal]           = useState(false)
  const [isUpdateConfirmModal, setIsUpdateConfirmModal] = useState(false)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [isRepeatModal, setIsRepeatModal] = useState(false)
  const [clickButton, setClickButton] = useState(1)
  const [member, setMember] = useState(mode !== "update"? '수업 또는 비수업을 선택해주세요.' : value.name)
  const [memberIdx, setMemberIdx] = useState(1)
  const [repeatOptionIdx, setRepeatOptionIdx] = useState(1)

  // datetimepicker - 날짜
  const [date, setDate] = useState(mode === "update"? new Date(value.start) : new Date())
  const [show, setShow] = useState(false)

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    console.log(selectedDate)
  }

  const showDatepicker = () => {
    setShow(true)
  }

  // datetimepicker - 시작시간
  const [fromTime, setFromTime] = useState(mode === "update"? value.start : new Date())
  const [showFromTime, setShowFromTime] = useState(false)

  const onFromTimeChange = (event, selectedDate) => {
    selectedDate.setHours(selectedDate.getHours() - 15)

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
  const [toTime, setToTime] = useState(mode === "update"? value.end : new Date())
  const [showToTime, setShowToTime] = useState(false)

  const onToTimeChange = (event, selectedDate) => {
    
    selectedDate.setHours(selectedDate.getHours() - 15)

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
    if (member !== '수업 또는 비수업을 선택해주세요.') {
      setButtonEnable(true)
    }else{
      //setMember(`${value.name} (${new Date().getFullYear() - new Date(value.brith).getFullYear()}세)`) 
    }
  }, [member])

  async function AddSchedulesFuc() {

    const startAt = `${date.getFullYear()}-${Number(date.getMonth())+1<10? "0"+Number(date.getMonth())+1:Number(date.getMonth())+1}-${date.getDate()<10? "0"+date.getDate():date.getDate()}T${JSON.stringify(fromTime).split("T")[1].split("Z")[0]}`

    const endAt   = `${date.getFullYear()}-${Number(date.getMonth())+1<10? "0"+Number(date.getMonth())+1:Number(date.getMonth())+1}-${date.getDate()<10? "0"+date.getDate():date.getDate()}T${JSON.stringify(toTime).split("T")[1].split("Z")[0]}`        


    const addScheduleRequest = {
      "trainerId"     : Number(userInfo[0].sub),
      "startAt"       : startAt,
      "endAt"         : endAt,
      "partnershipId" : Number(memberIdx),
      "scheduleRepeat": {
        "type"    : clickButton === 1? "NONE" : clickButton === 2? "EVERY":"WEEK",
        "count"   : Number(repeatOptionIdx)
      }
    }

    console.log(addScheduleRequest)
    await fetch(`${config.BASE_URL}/schedules `,
    {
      method  : 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',
          
      },
      body:JSON.stringify(addScheduleRequest)
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.code === 0){
        alert("스케줄 등록이 완료되었습니다.")
        navigation.goBack()
      }else if(res.code === -13){
        alert("회원과 파트너쉽을 찾을 수 없습니다.")
      }else if(res.code === -14){
        alert("추가할 스케줄 시간이 기존 스케줄과 중복되었습니다.")
      }else if(res.code === -15){
        alert("스케줄 시작 시간과 끝 시간이 올바르지 않습니다.")
      }
      
    })
    .catch((e) => console.log(e))
  }

  async function EditSchedulesFuc() {

    const startAt = `${date.getFullYear()}-${Number(date.getMonth())+1<10? "0"+Number(date.getMonth())+1:Number(date.getMonth())+1}-${date.getDate()<10? "0"+date.getDate():date.getDate()}T${JSON.stringify(fromTime).split("T")[1].split("Z")[0]}`

    const endAt   = `${date.getFullYear()}-${Number(date.getMonth())+1<10? "0"+Number(date.getMonth())+1:Number(date.getMonth())+1}-${date.getDate()<10? "0"+date.getDate():date.getDate()}T${JSON.stringify(toTime).split("T")[1].split("Z")[0]}`        


    const updateScheduleRequest = {
      "startAt"       : startAt,
      "endAt"         : endAt,
      "scheduleId"    : Number(value.scheduleId),
    }

  
    await fetch(`${config.BASE_URL}/schedules `,
    {
      method  : 'PUT', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',
          
      },
      body:JSON.stringify(updateScheduleRequest)
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.code === 0){
        navigation.goBack()
        navigation.goBack()
      }else if(res.code === -13){
        alert("스케줄을 찾을 수 없습니다.")
      }else if(res.code === -14){
        alert("수정한 스케줄 시간이 다른 스케줄과 중복됩니다.")
      }

    })
    .catch((e) => console.log(e))
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          clickEvent={() => {
            navigation.goBack()
          }}
          title={'일정 등록 취소'}
          body={'일정 등록을 취소하고 나가시겠어요?\n모든 데이터가 지워질 수 있어요.'}
          buttonTitle={'일정 등록 취소하기'}
        />
      )}
      {isScheduleChooseModal && (
          <ScheduleChooseModal
            closeModal={() => {
              setIsScheduleChooseModal(false)
            }}
            setMember={setMember}
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
      {isUpdateConfirmModal && (

          <ModalDialog
            closeModal={() => {
              setIsUpdateConfirmModal(false)
            }}
            clickEvent={() => {
              // 수정 api 호출

              // 성공이면
              setIsUpdateConfirmModal(false)
              navigation.goBack()
            }}
            title={'스케쥴 수정'}
            body={'반복 일정이 포함되어 있어,\n이후 일정을 모두 변경하게 됩니다.'}
            buttonTitle={'수정하기'}
          />
      )}
      {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={mode !== "update"? date: value.start}
            mode={'date'}
            is24Hour={false}
            display="spinner"
            onChange={onDateChange}
          />
      )}
      {showFromTime && (
          <DateTimePicker
            testID="fromTimepicker"
            value={mode !== "update"? fromTime: value.start}
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
      <ScrollView>
        <Appbar.Header style={globalStyle.titleAppbar}>
          {mode === 'create' ? (
            <Appbar.Content
              title={'스케쥴 등록'}
              titleStyle={[globalStyle.heading1, globalStyle.center]}
            />
          ) : (
            <Appbar.Content
              title={'스케쥴 수정'}
              titleStyle={[globalStyle.heading1, globalStyle.center]}
            />
          )}

          <Pressable
            style={[globalStyle.header, globalStyle.absoluteRight]}
            onPress={() => setIsModal(true)}
          >
            <Image source={cross} style={globalStyle.title} />
          </Pressable>
        </Appbar.Header>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ width: '88.8%', marginBottom: 20 }}>
            <SelectBoxField
              title={'스케쥴 선택'}
              input={member}
              clickEvent={() => {
                setIsScheduleChooseModal(true)
              }}
              mode={mode}
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
              mode={mode}
            />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <SelectBoxField
                  title={'시작 시간'}
                  input={getTimeOfDate(fromTime)}
                  clickEvent={showFromTimepicker}
                  mode={mode}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <SelectBoxField
                  title={'끝 시간'}
                  input={getTimeOfDate(toTime)}
                  clickEvent={showToTimepicker}
                  mode={mode}
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
                mode={mode}
              />
              <Chip
                title={'매일'}
                isFirst={false}
                isFocus={clickButton === 2 ? true : false}
                clickEvent={() => setClickButton(2)}
                mode={mode}
              />
              <Chip
                title={'매주'}
                isFirst={false}
                isFocus={clickButton === 3 ? true : false}
                clickEvent={() => setClickButton(3)}
                mode={mode}
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
                    mode={mode}
                  />
                </View>
              </View>
            )}
          </View>
          {mode === 'create' ? (
            <ButtonLarge name={'등록'} isEnable={buttonEnable} onPress={AddSchedulesFuc}/>
          ) : (
            <ButtonLarge
              name={'수정'}
              isEnable={true}
              onPress={() => {
                EditSchedulesFuc()
                //if (clickButton === 0) {
                  // 스케쥴 수정 api
                //  EditSchedulesFuc()
                  // 성공이면
                //} else {
                //  setIsUpdateConfirmModal(true)
                //}
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddSchedule
