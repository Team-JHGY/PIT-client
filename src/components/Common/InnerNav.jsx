import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, ScrollView, Pressable } from 'react-native'


// utils
import globalStyle from '../../utils/globalStyle'

import home_on from '../../../assets/home_on.png'
import inner_calendar_on from '../../../assets/inner_calendar_on.png'
import inner_calendar_off from '../../../assets/inner_calendar_off.png'
import inner_home_off from '../../../assets/inner_home_off.png'


// context
import { UserContext } from '../../store/user'

export default function InnerNav({navigation, type}) {

  const { userState, userDispatch } = React.useContext(UserContext)

  return (
      userState.role === 'trainer'?

        <View style={[{height:60,width:"90%",backgroundColor:"#0F1528",borderRadius:10,margin:10, justifyContent: 'space-between' },globalStyle.row]}>
          <Pressable style={[{color:"#fff",width:"50%",textAlign:"center"}]}
          onPress ={()=>{
                navigation.navigate('Main')
           }}>
            <Image style={styles.icons} source={type === "main"? home_on:inner_home_off} />
            <Text style={[{color:"#fff",textAlign:"center",marginTop:5,fontSize:10}]}>홈</Text>
          </Pressable>
          <Pressable style={[{color:"#fff",width:"50%",textAlign:"center"}]} 
           onPress ={()=>{
                navigation.navigate('MealPlan')
           }}>
            <Image style={styles.icons} source={type === "meal"? inner_calendar_on:inner_calendar_off}/>
            <Text style={[{color:"#fff",textAlign:"center",marginTop:5,fontSize:10}]}>운동/식단</Text>
          </Pressable>
        </View>
        :
        null
      

  )
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  icons: {
    marginTop:10,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 24,
    height: 24,
  },
  appBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  appBarText: {
    ...globalStyle.body2,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 28,
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E101FF',
    resizeMode: 'cover',
    marginRight: 12,
  },
  svgImage: {
    marginTop: 20,
  },
  lesson: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '15%',
    paddingLeft: '6.25%',
  },
  numOfLesson: {
    color: '#00D98B',
    ...globalStyle.body2,
    lineHeight: 20,
    marginTop: 20,
  },
  lessonTime: {
    ...globalStyle.bodt2,
    lineHeight: 20,
    marginTop: 5,
  },
})
