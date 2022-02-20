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
import * as DocumentPicker from 'expo-document-picker';
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
  
  const dateValueDate = new Date(dateValue)
  //console.log("mealId", mealId)

  // datetimepicker - 날짜
  const [date, setDate]                                 = useState(new Date(dateValue))
  const [show, setShow]                                 = useState(false)
  const { userState, userDispatch }                     = React.useContext(UserContext)
  const splitJwt                                        = userState.jwtToken.split('.')
  const userInfo                                        = JSON.parse(decode(splitJwt[1]))

  const [partnershipId, setPartnershipId]               = useState(null)
  const [isScheduleChooseModal, setIsScheduleChooseModal] = useState(false)
  const [clickButton, setClickButton]                   = useState(1)
  const [member, setMember]                             = useState('아침')
  const [memberIdx, setMemberIdx]                       = useState("BREAKFAST")
  const [image, setImage]                               = React.useState(null)
  const [secon, setSeconImage]                          = React.useState(null)
  const [thrid, setThridImage]                          = React.useState(null)
  const [image4, setImage4]                             = React.useState(null)
  const [image5, setImage5]                             = React.useState(null)
  
  const [deit1, setdeit1]                               = React.useState(null)
  const [deit2, setdeit2]                               = React.useState(null)
  const [deit3, setdeit3]                               = React.useState(null)
  const [deit4, setdeit4]                               = React.useState(null)
  const [deit5, setdeit5]                               = React.useState(null)

  
  const [intro, setIntro]                               = React.useState('')
  const titleDate                                       = `${dateValueDate.getMonth()+1}/${dateValueDate.getDate()}(${getDayOfWeek(dateValueDate)})`


  const onDateChange = (event, selectedDate) => {
  
    setShow(Platform.OS === 'ios')
    //console.log("currentDatㅂe", new Date(selectedDate.setHours(selectedDate.getHours() - 15)))
    
    setDate(new Date(selectedDate.setHours(selectedDate.getHours() - 15)))
  }

  const showDatepicker = () => {
    setShow(true)
  }



  // 등록버튼
  const [buttonEnable, setButtonEnable] = useState(false)

  const pickImage = async (title) => {
    
    let result = await DocumentPicker.getDocumentAsync({type: "image/*"})

    const imageValue = {
      uri   : result.uri,
      name  : result.name,
      type  : `image/${((result.name).slice(-5)).split(".")[1]}`
    }

    
    //dietImage
    if(title === "image"){
      setImage(result.uri)
      setdeit1(imageValue)
    }else if( title === "secon"){
      setSeconImage(result.uri)
      setdeit2(imageValue)
    }else if(title === "thrid"){
      setThridImage(result.uri)
      setdeit3(imageValue)
    }else if(title === "image4"){
      setImage4(result.uri)
      setdeit4(imageValue)
    }else{
      setImage5(result.uri)
      setdeit5(imageValue)
    }

    //console.log(dietImage)
    setButtonEnable(true)
    
  }

  async function PostAddMealPlan() {

    //등록 날짜date.setHours(date.getHours() -15)
    
    const dateFormValue = JSON.stringify(dateValue).split("T")[0].replace('"',"")

    const addDate = `${dateFormValue}T${JSON.stringify(date).split("T")[1].split("Z")[0]}Z`

    //등록 이미지 관련

    //등록할 게시물 내용

    const addDietRequest = {
      "timestamp"     : addDate,
      "type"          : memberIdx,
      "description"   : intro.trim(),
      "score"         : clickButton === 1? "GOOD" : clickButton === 2? "SOSO": "BAD",
      "partnershipId" : partnershipId
    }
    console.log(addDietRequest)
    
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
      
        //이미지가 없으면 call이 안간다.
        if(res.code === 0 && image !== null){

          const formdata = new FormData();
                formdata.append("dietImage", {uri: deit1.uri, name: deit1.name,  type: deit1.type} );

                
                deit2 === null? null : formdata.append("dietImage", {uri: deit2.uri, name: deit2.name, type: deit2.type});
                deit3 === null? null : formdata.append("dietImage", {uri: deit3.uri, name: deit3.name, type: deit3.type});
                deit4 === null? null : formdata.append("dietImage", {uri: deit4.uri, name: deit4.name, type: deit4.type});
                deit5 === null? null : formdata.append("dietImage", {uri: deit5.uri, name: deit5.name, type: deit5.type});
                
          let headerValue = new Headers()
                headerValue.append("Authorization", userState.jwtToken)
                headerValue.append("Content-Type", 'multipart/form-data')
          
          fetch(`${config.BASE_URL}/diet/${res.data.id}/image`,{
            method  : 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            body: formdata,
            headers: headerValue
          })
          .then((res) =>res.json())
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
          //sconsole.log("데이타", res)
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
            

            setdeit1(res.data.images[0] === undefined? null :{
              uri   : res.data.images[0].path,
              name  : res.data.images[0].path,
              type  : `image/${((res.data.images[0].path).slice(-35)).split("_")[0].split(".")[1]}`
            })
            setdeit2(res.data.images[1] === undefined? null :{
              uri   : res.data.images[1].path,
              name  : res.data.images[1].path,
              type  : `image/${((res.data.images[1].path).slice(-35)).split("_")[0].split(".")[1]}`
            })
            setdeit3(res.data.images[2] === undefined? null :{
              uri   : res.data.images[2].path,
              name  : res.data.images[2].path,
              type  : `image/${((res.data.images[2].path).slice(-35)).split("_")[0].split(".")[1]}`
            })
            setdeit4(res.data.images[3] === undefined? null :{
              uri   : res.data.images[3].path,
              name  : res.data.images[3].path,
              type  : `image/${((res.data.images[3].path).slice(-35)).split("_")[0].split(".")[1]}`
            })
            setdeit5(res.data.images[4] === undefined? null :{
              uri   : res.data.images[4].path,
              name  : res.data.images[4].path,
              type  : `image/${((res.data.images[4].path).slice(-35)).split("_")[0].split(".")[1]}`
            })

            //이미지
            setImage(res.data.images[0] === undefined? null : res.data.images[0].path)
            setSeconImage(res.data.images[1] === undefined? null : res.data.images[1].path)
            setThridImage(res.data.images[2] === undefined? null : res.data.images[2].path)
            setImage4(res.data.images[3] === undefined? null : res.data.images[3].path)
            setImage5(res.data.images[4] === undefined? null : res.data.images[4].path)
            
          } else {
            //console.log(res)
          }
        })
        .catch((e) => console.log(e))

  }

  async function DelMealImage(){
    axios(`${config.BASE_URL}/diet/${mealId}/images`,{
      method  : 'DELETE', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization' : userState.jwtToken,
        'Content-Type'  : 'application/json',  
      }
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
        //이미지가 없으면 call이 안간다.
        if(image !== null){
          //이미지 전체 삭제
          DelMealImage()

          const formdata = new FormData();
                formdata.append("dietImage", {uri: deit1.uri, name: deit1.name,  type: deit1.type} );

                
                deit2 === null? null : formdata.append("dietImage", {uri: deit2.uri, name: deit2.name, type: deit2.type});
                deit3 === null? null : formdata.append("dietImage", {uri: deit3.uri, name: deit3.name, type: deit3.type});
                deit4 === null? null : formdata.append("dietImage", {uri: deit4.uri, name: deit4.name, type: deit4.type});
                deit5 === null? null : formdata.append("dietImage", {uri: deit5.uri, name: deit5.name, type: deit5.type});
                
          console.log(formdata)


          let headerValue = new Headers()
                headerValue.append("Authorization", userState.jwtToken)
                headerValue.append("Content-Type", 'multipart/form-data')

          //이미지 다시 넣기
          fetch(`${config.BASE_URL}/diet/${res.data.id}/image`,{
            method  : 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            body:formdata,
            headers: headerValue
          })
          .then((res) => res.json())
          .then((res) =>{
            console.log("이미지 수정",res)
            if(res.code === 0){
             alert("식단 수정을 완료했습니다.") 
            }
            navigation.goBack()
          })
          .catch((e)=>{
            console.log("식단",e.config)
            alert("식단 이미지 수정을 실패했습니다.");
            
          })
        }else{
          navigation.goBack()
        }
      }
      
    })
    .catch((e) => {alert("식단 등록을 실패했습니다.")})


  }

  async function DelMealPlan() {
    await fetch(`${config.BASE_URL}/diet/${mealId}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Authorization': userState.jwtToken,
        'Content-Type' : 'application/json',
      },

    })
      .then((res) => res.json())
      .then((res) => {
        
        if (res.code === 0) {
          alert("식단 삭제를 성공했습니다.")
        }
        navigation.goBack()
        navigation.goBack()
      })
      .catch((e) => { alert("식단 삭제를 실패했습니다.");console.log(e)})
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
          <View style={{flexDirection: 'row'}}>
            <Text style={{ ...globalStyle.body2 }}>{'사진 등록'}</Text>
            <Text style={{ ...globalStyle.body2, ...globalStyle.textDartGery }}>{'  (사진 삭제를 위해서는 썸네일을 클릭해주세요)'}</Text>
          </View>
          
            <View style={{flexDirection: 'row'}}>
              <ScrollView horizontal={true}>

              
                {image !== null? 
                
                <Pressable onPress={()=>{setImage(null);setdeit1(null)}}>
                    
                    <Image source={{ uri: image }} style={styles.profile} />
                </Pressable>
                    
                : 
                    <Pressable onPress={()=>pickImage("image")}>
                        <WithLocalSvg asset={AddMealPhoto}/>
                    </Pressable>
                }
                {secon !== null ? 
                    
                    <Pressable onPress={()=>{setSeconImage(null);setdeit2(null)}}>
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
                    
                    <Pressable onPress={()=>{setThridImage(null);setdeit3(null)}}>
                        <Image source={{ uri: thrid }} style={styles.profile} />
                    </Pressable>
                    
                    
                    
                : 
                image !== null && secon !== null && thrid === null?
                    <Pressable onPress={()=>pickImage("thrid")}>
                        <WithLocalSvg asset={AddMealPhoto}/>
                    </Pressable>
                    :null
                }
                {image4 !== null ? 
                    
                    <Pressable onPress={()=>{setImage4(null);setdeit4(null)}}>
                        <Image source={{ uri: image4 }} style={styles.profile} />
                    </Pressable>
                    
                    
                    
                : 
                image !== null && secon !== null && thrid !== null && image4 === null ?
                    <Pressable onPress={()=>pickImage("image4")}>
                        <WithLocalSvg asset={AddMealPhoto}/>
                    </Pressable>
                    :null
                }
                {image5 !== null ? 
                    
                    <Pressable onPress={()=>{setImage5(null);setdeit5(null)}}>
                        <Image source={{ uri: image5 }} style={styles.profile} />
                    </Pressable>
   
                : 
                image !== null && secon !== null && thrid !== null && image4 !== null && image5 === null ?
                    <Pressable onPress={()=>pickImage("image5")}> 
                        <WithLocalSvg asset={AddMealPhoto}/>
                    </Pressable>
                    :null
                }
              </ScrollView>
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
          <View style={{flexDirection: 'row', marginRight:20, marginLeft:20, marginBottom:20}}>
            <Pressable style={styles.redbutton} onPress={() => DelMealPlan()}>
              <Text style={styles.redtext}>식단 삭제</Text>
            </Pressable>
            <Pressable style={styles.greenenable} onPress={() => EditMealPlan()}>
              <Text style={styles.greentext}>식단 수정</Text>
            </Pressable>

          </View>
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
    },
    redbutton: {
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 10,
      borderColor: '#FF8989',
      flex: 1,
      height:60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    redtext: {
      ...globalStyle.button,
      lineHeight: 25,
      fontStyle: 'normal',
      fontWeight: 'normal',
      color: '#DD0101',
    },
    greentext: { ...globalStyle.button },
    greenenable: {
    backgroundColor: '#2AFF91',
    height: 60,
    borderRadius: 10,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    position: 'relative',
  },
})


