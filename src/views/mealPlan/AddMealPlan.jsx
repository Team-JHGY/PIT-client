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
  getTimeOfDate,
} from '../../utils/commonFunctions'

// context
import { UserContext } from '../../store/user'
import { decode } from 'js-base64'
import config from '../../utils/config'


// assets
import cross from '../../../assets/cross.png'
import Asterisk from '../../../assets/icon/asterisk.svg'
import AddMealPhoto from "../../../assets/img/mealPlan/AddMealPhoto.svg"
import axios from 'axios'


export default function AddMealPlan ({ navigation, route }) {
  // mode
  const { mode, dateValue, mealId } = route.params
  
  //console.log("dateValue", dateValue)

  // datetimepicker - 날짜
  const [date, setDate]                                 = useState(new Date(dateValue))
  const [show, setShow]                                 = useState(false)
  const { userState, userDispatch }                     = React.useContext(UserContext)
  const splitJwt                                        = userState.jwtToken.split('.')
  const userInfo                                        = JSON.parse(decode(splitJwt[1]))

  const [partnershipId, setPartnershipId]               = useState(null)
  const [isUpdateConfirmModal, setIsUpdateConfirmModal] = useState(false)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [clickButton, setClickButton]                   = useState(1)
  const [member, setMember]                             = useState('아침')
  const [memberIdx, setMemberIdx]                       = useState("BREAKFAST")
  const [image, setImage]                               = React.useState(null)
  const [secon, setSeconImage]                          = React.useState(null)
  const [thrid, setThridImage]                          = React.useState(null)
  
  const [deit1, setdeit1]                               = React.useState(null)
  const [deit2, setdeit2]                               = React.useState(null)
  const [deit3, setdeit3]                               = React.useState(null)

  
  const [intro, setIntro]                               = React.useState('')
  const titleDate                                       = `${dateValue.getMonth()+1}/${dateValue.getDate()}(${getDayOfWeek(dateValue)})`


  const onDateChange = (event, selectedDate) => {
  
    setShow(Platform.OS === 'ios')
    //console.log("currentDate", new Date(selectedDate.setHours(selectedDate.getHours() - 15)))
    setDate(new Date(selectedDate.setHours(selectedDate.getHours() - 15)))
  }

  const showDatepicker = () => {
    setShow(true)
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
          formData.append("dietImage", imageValue)
    
    //dietImage
    if(title === "image"){
      setImage(result.uri)
      setdeit1(formData)
    }else if( title === "secon"){
      setSeconImage(result.uri)
      setdeit2(formData)
    }else{
      setThridImage(result.uri)
      setdeit3(formData)
    }

    //console.log(dietImage)
    setButtonEnable(true)
    
  }

  async function PostAddMealPlan() {

    //등록 날짜date.setHours(date.getHours() -15)
    const addDate = `${dateValue.getFullYear()}-${("0"+Number(dateValue.getMonth())+1).slice(-2)}-${dateValue.getDate()<10? "0"+dateValue.getDate():dateValue.getDate()}T${JSON.stringify(date).split("T")[1].split("Z")[0]}Z`

    //등록 이미지 관련

    //등록할 게시물 내용
    const addDietRequest = {
      "timestamp"     : addDate,
      "type"          : memberIdx,
      "description"   : intro.trim(),
      "score"         : clickButton === 1? "GOOD" : clickButton === 2? "SOSO": "BAD",
      "partnershipId" : partnershipId
    }

    await fetch(`${config.BASE_URL}/diet `, //식단 추가
    {
      method  : 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',
          
      },
      body:JSON.stringify(addDietRequest)
    })
    .then((res) => res.json())
    .then((res) => {
      
      if(res.code === 0){
        
        //이미지가 없으면 call이 안간다.
        if(image !== null){
          

          const dataForm = [ 
                            {dietImage: deit1},
                            deit2 === null? null:{dietImage: deit2},
                            deit3 === null? null:{dietImage: deit3},
                         
                            ]

          axios.post(`${config.BASE_URL}/diet/${res.data.id}/image?`,{
            //method  : 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
              'Authorization' : userState.jwtToken,
              'Content-Type'  : 'application/json',  
            },
            body: dataForm
          })
          .then((res) => res.json())
          .then((res) =>{
            if(res.code === 0){
             alert("식단 등록을 완료했습니다.") 
             
            }else{
              alert("식단 이미지 등록을 실패했습니다.")
            }
           
          })
          .catch((e)=>{alert("식단 이미지 등록을 실패했습니다.");console.log(e)})
        }
      }
      navigation.goBack()
    })
    .catch((e) => {alert("식단 등록을 실패했습니다.");console.log(e)})


  }


  React.useEffect(()=>{
    if(mode === "edit") {
      GetMealPlanInfo()
    }else{
      getActivatedTrainerInfo()
    }
    
  },[])

  React.useEffect(()=>{
    if(intro.length !== 0){
      setButtonEnable(true)
    }else{
      setButtonEnable(false)
    }

  },[intro])

  async function getActivatedTrainerInfo() {
    await fetch(`${config.BASE_URL}/partnerships/${userInfo.sub}/trainers`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        
        if (res.code === 0) {
          let activatedTrainerInfo = res.data.trainers.find((v, i) => {
            if (v.isEnabled === true) return true
          })
          setPartnershipId(activatedTrainerInfo.partnershipId)
          
        } else {
          //console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  async function GetMealPlanInfo(){

      await fetch(`${config.BASE_URL}/diet/${mealId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization : userState.jwtToken,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          
          if (res.code === 0) {
            
            setDate(new Date(res.data.timestamp))
            setIntro(res.data.description)
            setClickButton(res.data.score === "SOSO"? 2:res.data.score === "GOOD"? 1:3)
            setMember(res.data.type === "DINNER"? "저녁":
              res.data.type === "BREAKFAST"? "아침":
                res.data.type === "LUNCH"? "점심":
                  res.data.type === "SNACK"? "간식":"야식"
            )
            setMemberIdx(res.data.type)

            //이미지
            setImage(res.data.images[0] === undefined? null : res.data.images[0])
            setSeconImage(res.data.images[1] === undefined? null : res.data.images[1])
            setThridImage(res.data.images[2] === undefined? null : res.data.images[2])

            
          } else {
            //console.log(res)
          }
        })
        .catch((e) => console.log(e))

  }

  async function DelMealImage(){
    axios(`${config.BASE_URL}/diet/${mealId}/images?`,{
      method  : 'DELETE', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',  
      },
      body: dataForm
    })
    .catch((e)=>{alert("식단 이미지 삭제를 실패했습니다.");console.log(e)})
  }


  async function EditMealPlan() {

    //등록 날짜date.setHours(date.getHours() -15)
    const addDate = `${dateValue.getFullYear()}-${("0"+Number(dateValue.getMonth())+1).slice(-2)}-${dateValue.getDate()<10? "0"+dateValue.getDate():dateValue.getDate()}T${JSON.stringify(date).split("T")[1].split("Z")[0]}Z`

    //등록 이미지 관련

    //등록할 게시물 내용
    const updateDietRequest = {
      "timestamp"     : addDate,
      "type"          : memberIdx,
      "description"   : intro.trim(),
      "score"         : clickButton === 1? "GOOD" : clickButton === 2? "SOSO": "BAD",
    }

    //console.log(updateDietRequest)

    await fetch(`${config.BASE_URL}/diet/${mealId} `, //식단 추가
    {
      method  : 'PUT', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',
          
      },
      body:JSON.stringify(updateDietRequest)
    })
    .then((res) => res.json())
    .then((res) => {
      
      if(res.code === 0){
        //console.log("updateDietRequest",res.data)
        //이미지가 없으면 call이 안간다.
        if(image !== null){
          //이미지 전체 삭제
          DelMealImage()

          const dataForm = [ 
                            {dietImage: deit1},
                            deit2 === null? null:{dietImage: deit2},
                            deit3 === null? null:{dietImage: deit3},
                         
                            ]

          //이미지 다시 넣기
          axios.post(`${config.BASE_URL}/diet/${res.data.id}/image?`,{
            //method  : 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
              'Authorization' : userState.jwtToken,
              'Content-Type'  : 'application/json',  
            },
            body: dataForm
          })
          .then((res) => res.json())
          .then((res) =>{
            if(res.code === 0){
             alert("식단 등록을 완료했습니다.") 
            }else{
              alert("식단 이미지 등록을 실패했습니다.")
            }
            navigation.goBack()
          })
          .catch((e)=>{alert("식단 이미지 등록을 실패했습니다.");console.log(e)})
        }else{
          navigation.goBack()
        }
      }
      
    })
    .catch((e) => {alert("식단 등록을 실패했습니다.");console.log(e)})


  }

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
    <ScrollView>
    
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
          mode={'time'}
          is24Hour={true}
          display="spinner"
          onChange={onDateChange}
        />
      )}
    
      <Appbar.Header style={globalStyle.titleAppbar}>
        {mode === 'create' ? (
          <Appbar.Content
            title={`${titleDate} 식단 기록`}
            titleStyle={[globalStyle.heading1, globalStyle.center]}
          />
        ) : (
          <Appbar.Content
            title={`${titleDate} 식단 기록 수정`}
            titleStyle={[globalStyle.heading1, globalStyle.center]}
          />
        )}

        <Pressable
          style={[globalStyle.header, globalStyle.absoluteRight]}
          onPress={() => navigation.goBack()}
        >
          <Image source={cross} style={globalStyle.title} />
        </Pressable>
      </Appbar.Header>
      <View style={styles.introHeader}>
          <Text style={globalStyle.textDartGery}>
            해당 날짜 식단을 기록해보세요.
          </Text>
          <Text style={globalStyle.textDartGery}>
            식단 내용과 사진을 등록할 수 있습니다.
          </Text>
      </View>


      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ width: '88.8%' }}>
            <SelectBoxField
                title={'시간'}
                input={getTimeOfDate(date)}
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
                    {image !== null? 
                    
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
          <ButtonLarge 
            name={'등록'} 
            isEnable={buttonEnable}  
            onPress ={()=>{
              PostAddMealPlan()
            }}
          />
        ) : (
          <ButtonLarge
            name={'수정'}
            isEnable={true}
            onPress={() => {
              EditMealPlan()
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


