import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image,ScrollView } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import arrow_left from '../../../assets/arrow_left.png'


export default function MyTrainers({navigation}) {
    const [userCount, setUserCount]     = React.useState(1);
    const [userData, setUserData]       = React.useState(["1","2","3","4","5"])

    return (
        <>
        <Appbar.Header style={[globalStyle.appbarMainNotBorder ]}>
            <Pressable style={globalStyle.iconSize} onPress={() => navigation.goBack()}>
                <Image source={arrow_left} style={globalStyle.title} />
            </Pressable>

            <Appbar.Content title="나의 트레이너"  titleStyle={globalStyle.header}/>
            
        </Appbar.Header>
        <SafeAreaView style={userCount === 0? styles.mainForm : styles.mainFormUser}>
            {userCount === 0?
        
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
                                    <Text style={[globalStyle.body2]}>김회원 (남, 23세)</Text>
                                    <Text style={[globalStyle.body2, globalStyle.textDartGery]}>2021.06.13 등록</Text>
                                </View>
                                {index === 0? 
                                    
                                    <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date, styles.greenText]}>
                                        현재 트레이너
                                    </Text>
                                    
                                    :
                                    <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date]}>06.13</Text>
                                }
                                
                            </View>
                        )
                    })}
                    <View style={styles.userInfo}>
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
        padding:20,
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
        color:"#ffffff",
        fontWeight:"bold"
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
        
    }
    
})

