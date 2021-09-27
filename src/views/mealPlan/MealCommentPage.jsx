import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image, ScrollView,TextInput } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Appbar } from 'react-native-paper'

// components
import ButtonLarge from '../../components/Common/ButtonLarge'
import ModalDialog from '../../components/Common/ModalDialog'
import SelectBoxField from '../../components/Schedule/SelectBoxField'
import Chip from '../../components/Schedule/Chip'
import MealChooseModal from './MealChooseModal'
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
import happy from "../../../assets/img/mealPlan/happy.svg"

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config"

export default function MealCommentPage ({ navigation }) {
  
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
  const [input, setInput]                 = React.useState('')

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
    
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content
          title={'9/13(화) 식단 기록'}
          titleStyle={[globalStyle.heading1, globalStyle.center]}
        />

        <Pressable
          style={[globalStyle.header, globalStyle.absoluteRight]}
          onPress={() => navigation.goBack()}
        >
          <Image source={cross} style={globalStyle.title} />
        </Pressable>
      </Appbar.Header>


      <View style={{flex: 1, backgroundColor:"#eee"}}>
          <View style={{height:360,backgroundColor:"#eee"}}>
              <Text>image</Text>
          </View>
          <View style={{padding:20, backgroundColor:"#FFF"}}>
            <Text style={{ ...globalStyle.heading2 }}>{'분류'}</Text>
            <Text>
              아침
            </Text>
            <Text style={{ ...globalStyle.heading2 }}>{'식단'}</Text>
            <Text>
              샐러드: 닭가슴살, 수란2개, 샐러리, 간고기
            </Text>
            <Text style={{ ...globalStyle.heading2 }}>{'점수'}</Text>
            <View style={[globalStyle.row]}>
              <WithLocalSvg asset={happy}/>
              <Text>Good</Text>
            </View>
          </View>

          <View style={{padding:20, marginTop:12, backgroundColor:"#FFF"}}>
            <Text style={{ ...globalStyle.heading2 }}>{'코멘트'}</Text>
            
              <Text style={styles.noComment}>
                코멘트가 없습니다.
              </Text>
            

            
          </View>
          <View style={[globalStyle.row,{padding:20, backgroundColor:"#FFF", borderTopColor:"#eee", borderTopWidth:2, alignItems:"center"}]}>
            <View style={{flexGrow:9}}>
              <TextInput
                style={[
                  {
                    height:55,
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
                placeholder={"입력된 텍스트"}
              />
            </View>
            
            <Pressable
              style={[globalStyle.appbarBtn, globalStyle.buttonGrey, globalStyle.center,styles.editWidth, styles.margin_right]}
            >
                <Text style={[globalStyle.appbarBtnText,{fontWeight:"bold"}]}>입력</Text>
            </Pressable>
          </View>
          
          
          
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
    },
    noComment:{
      margin:35,
      textAlign:"center",
      ...globalStyle.textDimmedGrey
    },
    editWidth:{
      height:55,
      width:60,
      textAlign: 'center',
      alignItems: "center",
      justifyContent: 'center',
      flexGrow:1

  },
})


