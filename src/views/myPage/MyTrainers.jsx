import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image,ScrollView } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import arrow_left from '../../../assets/arrow_left.png'

import { decode } from 'js-base64';

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config" 



export default function MyTrainers({navigation}) {
    const [userCount, setUserCount]     = React.useState(1);
    const [userData, setUserData]       = React.useState([])
    const { userState, userDispatch }     = React.useContext(UserContext)

    //jwt token decode
    const splitJwt = userState.jwtToken.split(".")
    const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))


    React.useEffect(() =>{
        MyTrainersList(userState.jwtToken)
    },[])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            MyTrainersList(userState.jwtToken)
        });

        return unsubscribe;
    }, [navigation]);

    async function MyTrainersList(token){
        await fetch(`${config.BASE_URL}/partnerships/${userInfo[0].sub}/trainers`,{
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
            
            if(res.code ===  0){
                setUserData(res.data.trainers)
                console.log(res.data.trainers)
                console.log(res.data.trainers.createdAt)
                setUserCount((res.data.trainers).length)
            }else {
                alert("fail")
                setUserData([])
            }
            

        })
        .catch((e) => console.log(e))
    }


    return (
        <>
        <Appbar.Header style={[globalStyle.appbarMainNotBorder ]}>
            <Pressable style={[globalStyle.iconSize, globalStyle.absolute]} onPress={() => navigation.goBack()}>
                <Image source={arrow_left} style={globalStyle.title} />
            </Pressable>

            <Appbar.Content title='나의트레이너'  titleStyle={globalStyle.header,globalStyle.center}/>
            
        </Appbar.Header>
        <SafeAreaView style={userCount === 0? styles.mainForm : styles.mainFormUser}>
            {userCount === 0?
        
                <View style={styles.centerArea}>
                    <Text style={[styles.disableText, styles.centerArea]}>등록된 회원이 없습니다.</Text>
                    <View style={styles.addTrainer}>
                        <Pressable 
                            style={styles.trainerAddBtn}
                            onPress={()=> {navigation.navigate('NewMembers')}}
                        >
                            <Text style={styles.trainerAddBtnTex}>트레이너 추가</Text>
                        </Pressable>
                    </View>
                </View>
            :
            
                <ScrollView>
                    {userData.map((item,index)=>{
                        return (
                            <View key={index} style={[globalStyle.row, styles.userInfo]}>
                                <View>
                                    {item.trainer.user.profileImage !== null? (
                                        <Image source={{ uri: item.trainer.user.profileImage.path }} style={styles.userImg} />
                                    ) : (
                                        <Image
                                        style={styles.userImg}
                                        source={require('../../../assets/img/SignUp/emptyProfile.png')}
                                        ></Image>
                                    )}
                                    
                                </View>
                                
                                <View style={globalStyle.col_2}>
                                    <Text style={[globalStyle.body2, styles.textmargin]}>
                                        {item.trainer.user.name} 
                                        
                                    </Text>
                                    <Text style={[globalStyle.body2, globalStyle.textDartGery, styles.textmargin]}>
                                        {item.trainer.createdAt === null? "없음": item.trainer.createdAt.split("T")[0].replace(/-/gi, ".")} 등록
                                    </Text>
                                </View>
                                {item.isEnabled  === true? 
                                    
                                    <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.greenText]}>
                                        현재 트레이너
                                    </Text>
                                    
                                    :
                                    <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date]}>
                                        {item.trainer.createdAt === null? 
                                            "없음"
                                            :
                                            item.trainer.createdAt.split("T")[0].replace(/-/gi, ".")
                                        }
                                    </Text>
                                }
                                
                            </View>
                        )
                    })}
                    <View style={styles.addTrainer}>
                        <Pressable 
                            style={styles.trainerAddBtn}
                            onPress={()=> {navigation.navigate('NewMembers')}}
                        >
                            <Text style={styles.trainerAddBtnTex}>트레이너 추가</Text>
                        </Pressable>
                    </View>
                    
                    
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
    },
    mainFormUser: {
        backgroundColor:"#ffff",
        flex: 1,
    },
    disableText:{
        ...globalStyle.body2,
        opacity:0.3,
        textAlign:"center"
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
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:"row",
        justifyContent:"center"
    },
    addTrainer:{
        paddingTop:20,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:"row",
        justifyContent:"center"
    },
    centerArea:{
        justifyContent:"center",

        textAlign:"center"
    },
    date:{
        justifyContent:"center"
    },
    greenText:{
        color:"#11F37E"
    },
    trainerAddBtn:{
        ...globalStyle.buttonLightGreen,
        width:200,
        height:60,
        borderRadius:100,
        justifyContent:"center",
    },
    trainerAddBtnTex:{
        ...globalStyle.button,
        fontWeight:"bold",
        textAlign:"center",
        
    },
    textmargin:{
        marginTop:-10
    }
    
})

