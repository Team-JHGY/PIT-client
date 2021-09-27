import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image, ScrollView } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Appbar } from 'react-native-paper'

// components
import ButtonLarge from '../../components/Common/ButtonLarge'
import ModalDialog from '../../components/Common/ModalDialog'
import SelectBoxField from '../../components/Schedule/SelectBoxField'
import Chip from '../../components/Schedule/Chip'
import MealChooseModal from '../../views/mealPlan/MealChooseModal'
import * as ImagePicker from 'expo-image-picker'
import TextField from '../../components/Common/TextField'

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
import AddMealPhoto from "../../../assets/img/mealPlan/AddMealPhoto.svg"

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config"

export default function AddMealPlan ({ navigation, route }) {
  // mode
  const { mode } = route.params
  // state
  const { userState, userDispatch }     = React.useContext(UserContext)
  const splitJwt                        = userState.jwtToken.split(".")
  const userInfo                        = React.useState(JSON.parse(decode(splitJwt[1])))

  const [isModal, setIsModal] = useState(false)
  const [isUpdateConfirmModal, setIsUpdateConfirmModal] = useState(false)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [isRepeatModal, setIsRepeatModal] = useState(false)
  const [clickButton, setClickButton] = useState(2)
  const [member, setMember] = useState('아침')
  const [memberIdx, setMemberIdx] = useState(1)
  const [repeatOptionIdx, setRepeatOptionIdx] = useState(1)
  const [image, setImage] = React.useState(null)
  const [secon, setSeconImage] = React.useState(null)
  const [thrid, setThridImage] = React.useState(null)
  const [intro, setIntro]               = React.useState('')

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

  const pickImage = async (title) => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes    : ImagePicker.MediaTypeOptions.All,
      allowsEditing : true,
      maxWidth      : 64, 
      maxHeight     : 64,
      aspect        : [4, 3],
      quality       : 1,
    })


    
    const imageValue = {
      uri   : result.uri,
      name  : result.uri,
      type  : "multipart/form-data"
    }
   
    const formData = new FormData()
          formData.append("profile", imageValue)
    
    
    if(title === "image"){
        setImage(result.uri)
    }else if( title === "secon"){
        setSeconImage(result.uri)
    }else{
        setThridImage(result.uri)
    }
    setButtonEnable(true)
    
  }


  


  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
    <ScrollView>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          clickEvent={() => {
            navigation.goBack()
          }}
          title={'식단 등록 취소'}
          body={'식단 등록을 취소하고 나가시겠어요?\n모든 데이터가 지워질 수 있어요.'}
          buttonTitle={'식단 등록 취소하기'}
        />
      )}
      {isScheduleChooseModal && (
        <MealChooseModal
          closeModal={() => {
            setIsScheduleChooseModal(false)
          }}
          setMember={setMember}
          memberIdx={memberIdx}
          setMemberIdx={setMemberIdx}
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
    
      <Appbar.Header style={globalStyle.titleAppbar}>
        {mode === 'create' ? (
          <Appbar.Content
            title={'9/13(화) 식단 기록'}
            titleStyle={[globalStyle.heading1, globalStyle.center]}
          />
        ) : (
          <Appbar.Content
            title={'9/13(화) 식단 기록 수정'}
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
      <View style={styles.introHeader}>
          <Text style={globalStyle.textDartGery}>
            해당 날짜 수업에 진행한 운동을 기록해보세요.
          </Text>
          <Text style={globalStyle.textDartGery}>
            운동 리스트와 사진을 등록할 수 있습니다.
          </Text>
      </View>


      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ width: '88.8%' }}>
            <SelectBoxField
                title={'시간'}
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
            <SelectBoxField
                title={'분류'}
                input={member}
                clickEvent={() => {
                    setIsScheduleChooseModal(true)
                }}
                mode={mode}
            />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={{ ...globalStyle.heading2 }}>{'식단 등록'}</Text>
            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
              <WithLocalSvg asset={Asterisk}></WithLocalSvg>
            </View>
          </View>

          <Text style={{ ...globalStyle.body2 }}>{'사진 등록'}</Text>
            <View style={{flexDirection: 'row'}}>
                    {image !== null ? 
                    
                    <Pressable onPress={()=>setImage(null)}>
                        <Image source={{ uri: image }} style={styles.profile} />
                    </Pressable>
                        
                    : 
                        <Pressable onPress={()=>pickImage("image")}>
                            <WithLocalSvg asset={AddMealPhoto}/>
                        </Pressable>
                    }
                    {secon !== null ? 
                        
                        <Pressable onPress={()=>setSeconImage(null)}>
                            <Image source={{ uri: secon }} style={styles.profile} />   
                        </Pressable>
                        
                        
                        
                    : 
                    image !== null && secon === null?
                        <Pressable onPress={()=>pickImage("secon")}>
                            <WithLocalSvg asset={AddMealPhoto}/>
                        </Pressable>
                        :
                        null
                    }
                    {thrid !== null ? 
                        
                        <Pressable onPress={()=>setThridImage(null)}>
                            <Image source={{ uri: thrid }} style={styles.profile} />
                        </Pressable>
                        
                        
                        
                    : 
                    image !== null && secon !== null && thrid === null?
                        <Pressable onPress={()=>pickImage("thrid")}>
                            <WithLocalSvg asset={AddMealPhoto}/>
                        </Pressable>
                        :null
                    }
                </View>
            
            
          
          <Text style={{ ...globalStyle.body2 }}>{'설명'}</Text>
          <TextField
            title={null}
            input={intro}
            height={130}
            isMultiLine={true}
            setInput={setIntro}
          />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={{ ...globalStyle.heading2 }}>{'점수'}</Text>
          </View>
          <View style={{ flexDirection: 'row',marginBottom:20 }}>
            <Chip
              title={'Good'}
              isFirst={true}
              isFocus={clickButton === 1 ? true : false}
              clickEvent={() => setClickButton(1)}
              mode={mode}
            />
            <Chip
              title={'So-So'}
              isFirst={false}
              isFocus={clickButton === 2 ? true : false}
              clickEvent={() => setClickButton(2)}
              mode={mode}
            />
            <Chip
              title={'Bad'}
              isFirst={false}
              isFocus={clickButton === 3 ? true : false}
              clickEvent={() => setClickButton(3)}
              mode={mode}
            />
          </View>
          
        </View>
        {mode === 'create' ? (
          <ButtonLarge name={'등록'} isEnable={buttonEnable} />
        ) : (
          <ButtonLarge
            name={'수정'}
            isEnable={true}
            onPress={() => {
              if (clickButton === 0) {
                // 스케쥴 수정 api

                // 성공이면
                navigation.goBack()
              } else {
                setIsUpdateConfirmModal(true)
              }
            }}
          />
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    profile: {
        marginRight:10,
        width: 92,
        height: 92,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    introHeader:{
        padding:20,
        backgroundColor:"#F5F5F5"
    }

})


