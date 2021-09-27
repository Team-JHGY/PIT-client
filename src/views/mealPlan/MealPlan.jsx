import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image, AsyncStorage, ScrollView, Modal } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import * as SplashScreen from 'expo-splash-screen'
import CalendarStrip from '../../utils/CalendarStrip/CalendarStrip'
import { Appbar } from 'react-native-paper'
import { WithLocalSvg } from 'react-native-svg'

//components
import Seperator from '../../components/Schedule/Seperator'


// assets
import arrow_left from '../../../assets/arrow_left.png'
import addFloating from '../../../assets/img/Schedule/addFloating.svg'
import whiteBtn1 from '../../../assets/img/mealPlan/whiteBtn1.svg'
import whiteBtn2 from '../../../assets/img/mealPlan/whiteBtn2.svg'
import AddMealPhoto from "../../../assets/img/mealPlan/AddMealPhoto.svg"
import happy from "../../../assets/img/mealPlan/happy.svg"
import Sad from "../../../assets/img/mealPlan/Sad.svg"
import Chat from "../../../assets/img/mealPlan/Chat.svg"

let date1 = new Date()
let date2 = new Date()
    date2.setDate(date2.getDate() - 2)
let todayDate = new Date()
let markedDateArray = [
  {
    date: date1,
    dots: [
      {
        color: '#00D98B',
        selectedColor: '#FFFFFF',
      },
    ],
  },
  {
    date: date2,
    dots: [
      {
        color: '#00D98B',
        selectedColor: '#FFFFFF',
      },
    ],
  },
]
export default function MealPlan({ navigation, route }) {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync()
  })

  // route
  let routeMsg = null
  if (route.params !== undefined) {
    routeMsg = route.params
  }

  // states
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('')
  const [lastDayOfWeek, setLastDayOfWeek]   = useState('')
  const [date, setDate]                     = useState(new Date())
  const [seleted, setSeleted]               = React.useState("meal")
  const [modalVisible, setModalVisible]     = useState(false);
  const [mealPanList, setMealPlanList]      = React.useState([
      {time:"오전 11:30", type:happy},
      {time:"오후 1:30", type:happy},
      {time:"오후 8:30", type:Sad},
      {time:"오후 1:30", type:Sad},
  ])

  React.useEffect(() => {
    AsyncStorage.getItem('userAuth', (err, result) => {
      //user_id에 담긴 아이디 불러오기
      //   console.log(result) // result에 담김 //불러온거 출력
    })
  }, [])
  return (
    <>
      
      <SafeAreaView style={[styles.mainFormUser,{backgroundColor:"#F5F5F5"}]} onLayout={onLayoutRootView}>
        <ScrollView >
            <Seperator/>

            <View style={styles.calendarContainer}>
                <Appbar.Header style={[styles.appBar]}>
                    <View style={[globalStyle.row, styles.headerImg]}>
                        <Pressable
                            style={[globalStyle.iconSize]}
                            onPress={() => navigation.goBack()}
                        >
                            <Image source={arrow_left} style={globalStyle.title} />
                        </Pressable>
                        <View style={[globalStyle.row, styles.appBar,styles.mainFormUser, styles.headerImg, styles.flexBasis]}>
                            <Image
                                style={styles.userImg}
                                source={{
                                uri: 'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg',
                                }}
                            />
                            <Text>양치승 T</Text>
                        </View>

                    </View>
                
                </Appbar.Header>

                <CalendarStrip
                    selectedDate={todayDate}
                    onDateSelected={(date) => {
                    setDate(new Date(date))
                    }}
                    scrollable={true}
                    style={{ height: 80, paddingTop: 5, paddingBottom: 10 }}
                    dateNumberStyle={{ color: '#000000' }}
                    dateNameStyle={{ color: '#A6ACB2' }}
                    highlightDateNumberStyle={{ color: '#FFFFFF' }}
                    highlightDateNameStyle={{ color: '#FFFFFF' }}
                    weekendDateNameStyle={{ color: '#DD0101' }}
                    styleWeekend={true}
                    highlightDateContainerStyle={{ backgroundColor: '#00D98B' }}
                    dayComponentHeight={60}
                    setFirstDayOfWeek={setFirstDayOfWeek}
                    setLastDayOfWeek={setLastDayOfWeek}
                    markedDates={markedDateArray}
                />
            </View>
            
            <View style={[styles.selectBtnList]}>
                <View style={[globalStyle.row,styles.selectBtnList, styles.allBtnList]}>
                    <Pressable style={seleted==="class"? styles.selectedBtn:styles.selectBtn} onPress={()=>setSeleted("class")}>
                        <Text style={{"textAlign":"center"}}>수업</Text>
                    </Pressable>
                    <Pressable style={seleted==="train"? styles.selectedBtn:styles.selectBtn}>
                        <Text style={{"textAlign":"center"}} onPress={()=>setSeleted("train")}>개인 운동</Text>
                    </Pressable>
                    <Pressable style={seleted==="meal"? styles.selectedBtn:styles.selectBtn}>
                        <Text style={{"textAlign":"center"}} onPress={()=>setSeleted("meal")}>식단</Text>
                    </Pressable>
                </View>
            </View>
            
            {/*식단 부분 뷰 */}
            {
                seleted ==="meal"?

                

                <View style={{margin:20}}>
                    <View style={[globalStyle.row,{ alignItems:"stretch"}]}>
                        <Text style={[styles.subTitle, {flexGrow:4}]}>식단 기록</Text>
                        {mealPanList.length === 0?
                            null
                            :
                            <Pressable
                                style={[globalStyle.appbarBtn, globalStyle.buttonGrey, globalStyle.center,styles.editWidth, styles.margin_right]}
                                onPress={(userData)=>navigation.navigate('AddMealPlan', { mode: 'edit' })} 
                            >
                                <Text style={globalStyle.appbarBtnText}>수정</Text>
                            </Pressable>
                        }
                    </View>
                    {mealPanList.length === 0?
                        <Text style={[styles.noMealPlan]}>식단 기록이 없습니다.</Text>
                        :
                        <ScrollView horizontal={true} style={[styles.MealPlan, globalStyle.row]}>
                            {mealPanList.map((item, index) =>{
                                return <View style={{marginRight:10}}>
                                            <Pressable onPress={() =>navigation.navigate('MealCommentPage')}>
                                                <WithLocalSvg asset={AddMealPhoto}/>
                                            </Pressable>
                                            
                                            <Text key={item.time+index}>{item.time}</Text>
                                            <View style={[globalStyle.row,{alignItems:"stretch"}]}>
                                                <View style={[globalStyle.row,{flexGrow:20, alignItems:"center"}]}>
                                                    <WithLocalSvg  asset={item.type}/>
                                                </View>
                                                <View style={[globalStyle.row,{alignItems:"center"}]}>
                                                    <WithLocalSvg asset={Chat}/>
                                                    <Text>1</Text>
                                                </View>
                                            </View>

                                        </View>
                                
                                
                            })}
                        </ScrollView>
                    }
                </View>
                
                :
                null
            } 






            {/*개인 운동 관련 뷰 */}
            {
                seleted==="train"?
                <View style={{"margin":20}}>
                    <Text style={[styles.subTitle]}>개인 운동</Text>
                    <Text style={[styles.noMealPlan]}>개인 운동 기록이 없습니다.</Text>
                </View>
                :
                null
            } 
            {/*수업 관련 뷰 */}
            {
                seleted==="class"?
                <View style={{"margin":20}}>
                    <Text style={[styles.subTitle]}>수업</Text>
                    <Text style={[styles.noMealPlan]}>수업 기록이 없습니다.</Text>
                </View>
                :
                null
            } 
            

            
            
        </ScrollView>
        
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
        >
            <View style={[styles.centeredView,]}>
                <Pressable style={styles.bottomoList}></Pressable>
                <Pressable 
                    style={[globalStyle.row, styles.selectBtnList]}
                    onPress={()=>{
                        setModalVisible(!modalVisible)
                        navigation.navigate('AddMealPlan', { mode: 'create' })}
                    }
                >
                    <Text style={[styles.whiteBtn,{marginBottom:18, marginRight:10}]}>식단 기록</Text>
                    <WithLocalSvg style={{marginRight:15, marginBottom:18}} asset={whiteBtn2}/>
                </Pressable>
                <Pressable 
                    style={[globalStyle.row, styles.selectBtnList]}
                    onPress={()=>{setModalVisible(!modalVisible)}}
                >
                    <Text style={styles.whiteBtn}>나의 수업 운동 기록</Text>
                    <WithLocalSvg style={{marginRight:5}} asset={whiteBtn1} />
                </Pressable>
                
                <Pressable
                    style={styles.floatingButton}
                    onPress={() => {
                    //navigation.navigate('AddSchedule', { mode: 'create' })
                    setModalVisible(!modalVisible)
                    }}
                >
                    <WithLocalSvg asset={addFloating} />
                </Pressable>
            </View>
        </Modal>
        <Pressable
            style={[styles.floatingButton, styles.paddingRight]}
            onPress={() => {
            //navigation.navigate('AddSchedule', { mode: 'create' })
            setModalVisible(!modalVisible)
            }}
        >
            <WithLocalSvg asset={addFloating} />
        </Pressable>

      </SafeAreaView>
        
    </>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainFormUser: {
    backgroundColor:"#ffff",
    flex: 1
  },
  paddingRight:{
    marginRight:20,
  },
  whiteBtn:{
    color:"#fff"
  },
  appBar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#ffff",
    elevation: 0,
    height: 60,
  },
  bottomoList:{
    flex:5,
    backgroundColor:"red",
    position:"relative",
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight:0,
    alignSelf:'flex-end',
    justifyContent:"flex-end"
  },
  headerImg:{
    alignItems:"center",
    alignContent: "space-between",
    flex: 1,
  },
  flexBasis:{
    flexBasis:300
  },
  disableText: {
    ...globalStyle.body2,
    opacity: 0.3,
  },
  calendarContainer: {
    backgroundColor:"#ffff",
    width:"100%",
    alignSelf: 'stretch',
    marginTop: 5,
    shadowColor: 'black',
    shadowOffset: {
        width: 0,
        height: -20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  selectBtnList:{
    alignItems:"center",
    margin:"auto"
  },
  allBtnList:{
    marginRight:20,
    marginLeft:20,
    backgroundColor: '#E8ECEF',
    marginTop:16,
    borderRadius:6,
    maxWidth:320
  },
  selectBtn:{
    flexGrow:1,
    flexBasis:100,
    padding:10,
    borderRadius:6
  },
  selectedBtn:{
    flexGrow:1,
    flexBasis:100,
    padding:10,
    borderRadius:6,
    ...globalStyle.buttonLightGreen
  },
  userImg: {
    alignItems:"center",
    width: 44,
    height: 44,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E101FF',
    resizeMode: 'cover',
    marginRight: 12,
  },
  floatingButton: {
    flex:1,
    zIndex:999,
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight:0,
    alignSelf:'flex-end',
    justifyContent:"flex-end"
  },
  floatingButtonOver: {
    flex:1,
    zIndex:999,
    position: 'relative',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    alignSelf:'flex-end',
    justifyContent:"flex-end"
  },
  subTitle:{
    fontSize:20,
    fontWeight:"bold"
  },
  noMealPlan:{
    margin:35,
    textAlign:"center",
    ...globalStyle.textDimmedGrey
  },
  MealPlan:{
    padding:20,
    paddingRight:40,
    borderRadius:10,
    backgroundColor:"#fff",
    marginTop:22,
  },
  centeredView: {
    paddingBottom:50,
    paddingRight:20,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor:"rgba(0, 0, 0, 0.4)",
    
  },
  editWidth:{
    width:60,
    textAlign: 'center',
    alignItems: "center",
    justifyContent: 'center',
},
})
