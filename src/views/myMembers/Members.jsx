import React, { useCallback, useEffect, useState, useContext } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image,ScrollView } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import NewMembers from './NewMember'
import sortArrow from "../../../assets/sortArrow.png"
import cross from "../../../assets/cross.png"
import { decode } from 'js-base64';

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config" 


export default function Members({navigation}) {
    const [appBarArray, setAppBarArray] = React.useState([])
    const [userCount, setUserCount]     = React.useState(1);
    const [isNew, setIsNew]             = React.useState("Y");
    const [userData, setUserData]       = React.useState([])
    const { userState, userDispatch } = useContext(UserContext)
    const splitJwt = userState.jwtToken.split(".")
    const userInfo = JSON.parse(decode(splitJwt[1]))


    React.useEffect(()=>{
        //비동기로 멤버 리스트 불러오기
        MemberList(userState.jwtToken)
    },[])


    async function MemberList(token) {
        if(userInfo.type === "TRAINER"){
            await fetch(`${config.BASE_URL}/partners/${userInfo.sub}/trainers`,{
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'include', // include, *same-origin, omit
                headers: {
                    'Authorization' : token,
                    'Content-Type'  : 'application/json',
                    
                },
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                if(res.code ===  0){
                    setUserData(res.data)
                }else if(res.code === -13){
                    setUserData([])
                }
                

            })
            .catch((e) => console.log(e))  
        }else{
            await fetch(`${config.BASE_URL}/partners/${userInfo.sub}/members`,{
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'include', // include, *same-origin, omit
                headers: {
                    'Authorization' : token,
                    'Content-Type'  : 'application/json',
                    
                },
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                if(res.code ===  0){
                    setUserData(res.data)
                }else if(res.code === -13){
                    setUserData([])
                }
                

            })
            .catch((e) => console.log(e))
        }
        
    }

    return (
        <>
         <Appbar.Header style={globalStyle.appbarMain}>
            <Appbar.Content title="나의 회원"  titleStyle={globalStyle.heading1}/>
            <Pressable
                style={[globalStyle.appbarBtn, globalStyle.center]}
                onPress={()=>navigation.navigate('NewMembers')} 
            >
                <Text style={[globalStyle.appbarBtnText, globalStyle.center]}>회원추가</Text>
            </Pressable>
            <Pressable
                style={[globalStyle.appbarBtnArrow]}
                
            >
                <Image source={sortArrow} style={globalStyle.arrowImg}/>
            </Pressable>
            
        </Appbar.Header>
        <SafeAreaView style={userData.length === 0? styles.mainForm : styles.mainFormUser}>
            {userData.length === 0?
        
                <View>
                    <Text style={styles.disableText}>등록된 회원이 없습니다.</Text>
                </View>
            :
            
                <ScrollView>
                    
                    {userData.map((item,index)=>{
                        return (
                            <View key={index} style={[globalStyle.row, styles.userInfo]}>
                                <View>
                                    <Image source={{uri:'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg'}} style={[styles.userImg]}/>
                                </View>
                                
                                <View style={globalStyle.col_2}>
                                    <Text style={[globalStyle.body2,styles.textmargin]}>김회원 (남, 23세)</Text>
                                    <Text style={[globalStyle.body2, globalStyle.textDartGery,styles.textmargin]}>2021.06.13 등록</Text>
                                </View>
                                {isNew === "Y"? 
                                    <>
                                    <View style={styles.newMark}>
                                        <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.newMarkText]}>
                                            N
                                        </Text>
                                    </View>
                                    <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date, styles.greenText,styles.textmargin]}>06.13</Text>
                                    </>
                                    :<Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date]}>06.13</Text>
                                }
                                
                            </View>
                        )
                    })}

                    
                </ScrollView>
            }
        </SafeAreaView>
        </>
    )
}

//스타일 가이드 
const styles = StyleSheet.create({
    mainForm: {
        backgroundColor:"#ffff",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    mainFormUser: {
        backgroundColor:"#ffff",
        flex: 1,
    },
    disableText:{
        ...globalStyle.body2,
        opacity:0.3
    },
    aliginCenter:{
        justifyContent: "center",
        alignItems: "center"
    },
    disableText:{
        ...globalStyle.body2,
        opacity:0.3
    },
    userImg:{
        width:44,
        height:44,
        borderRadius:25,
        resizeMode: "cover",
        marginRight:12
    },
    userInfo:{
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:"row",
        justifyContent:"center"
    },
    date:{
        justifyContent:"center"
    },
    greenText:{
        color:"#11F37E"
    },
    newMark:{
        backgroundColor:"#11F37E",
        borderRadius:10,
        height:21,
        width:26, 
        justifyContent:"center",
        margin:2
    },
    newMarkText:{
        textAlign:"center",
        justifyContent:"center",
        color:"#ffffff",
        fontWeight:"bold",
        alignItems: "center"
    },
    textmargin:{
        marginTop:-10
    }
    
})

