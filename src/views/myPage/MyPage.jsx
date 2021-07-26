import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image, ScrollView, AsyncStorage } from 'react-native'
import Clipboard from "expo-clipboard"
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper'
import arrow_right from '../../../assets/arrow_right.png'

export default function MyPage({navigation}) {
    const [appBarArray, setAppBarArray] = React.useState([])
    const [trainerCode, setTrainerCode] = React.useState('12345')
    const [userAuth, setUserAuth]         = React.useState()

    const copyToClipboard = () => {
            Clipboard.setString(trainerCode)
            alert("복사되었습니당.")
    };

    function AddtoLocalUserAuth(){
        AsyncStorage.getItem("userAuth", (err, result) => { //user_id에 담긴 아이디 불러오기
            setUserAuth(result); // result에 담김 //불러온거 출력
        });
    }

    React.useEffect(()=>{
        AddtoLocalUserAuth()
    },[])


    return (
        <>
        <Appbar.Header style={globalStyle.appbarMain}>
            <Appbar.Content title="마이"  titleStyle={[globalStyle.heading1, styles.barHeader]}/>
            <Pressable
                style={[globalStyle.appbarBtn, globalStyle.buttonGrey, globalStyle.center,styles.editWidth, styles.margin_right]}
                onPress={()=>navigation.navigate('EditMyPage')} 
            >
                <Text style={globalStyle.appbarBtnText}>편집</Text>
            </Pressable>
            <Text></Text>
                
           
            
        </Appbar.Header>
        <SafeAreaView style={styles.mainForm}>
            <ScrollView>
                <View style={styles.myPageInfoImg}>
                    <Image source={{uri:'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg'}} style={styles.userImg}/>
                </View>
                
                
                { userAuth === "member"?
                    <Pressable 
                        style={[styles.myPageInfo, globalStyle.row, globalStyle.buttonLightGreen, styles.trainerBtn]}
                        onPress={() => {navigation.navigate('MyTrainers')}}
                    >
                        <View style={[globalStyle.col_1, styles.alignCenter, styles.padding_Left]}>
                            <Text style={globalStyle.body2, globalStyle.textDartGery}>현재 트레이너</Text>
                            <Text style={globalStyle.heading2}>양치승 T</Text>
                        </View>
                        <View style={[globalStyle.col_2, styles.alignCenter, styles.padding_Left]}>
                            <Text style={globalStyle.body2, globalStyle.textDartGery}>함께 운동했던 선생님들</Text>
                            <Text style={globalStyle.heading2}>총 3 명</Text>
                        </View>
                        <View style={[globalStyle.col_1, styles.alignCenter, styles.padding_Left]}>
                            <Image source={arrow_right} style={styles.arrow_right} />
                        </View>
                    </Pressable>
                    :
                    null
                }
                <View style={[styles.myPageInfo]}>
                    <Text style={[globalStyle.heading2, styles.userName]}>이름</Text>
                    <Text style={[globalStyle.body2, styles.userNameInfo]}>김태리</Text>
                </View>
                { userAuth === "member"?
                    <>
                    <View style={[styles.myPageInfo]}>
                        <Text style={[globalStyle.heading2, styles.userName]}>성별</Text>
                        <Text style={[globalStyle.body2, styles.userNameInfo]}>여</Text>
                    </View>
                    <View style={[styles.myPageInfo]}>
                        <Text style={[globalStyle.heading2, styles.userName]}>생년월일</Text>
                        <Text style={[globalStyle.body2, styles.userNameInfo]}>1992.08.03 (30세)</Text>
                    </View>
                    </>
                    :
                    null
                }
        


                <View style={styles.myPageInfo}>
                    <Text style={[globalStyle.heading2, styles.userName]}>자기 소개</Text>
                    <Text style={[globalStyle.body2, styles.userNameInfo]}>
                        회원님의 건강과 아름다운 몸을 책임질 양치승 트레이너 입니다 ^^{"\n"}
                        -생활 체육지도사 보디빌딩 2급 {"\n"}
                        -운동처방사 교육 수료 {"\n"}
                        -재활운동처방사 자격 취득
                    </Text>
                </View>
                <View style={[styles.myPageInfo, globalStyle.row]}>
                    <View style={globalStyle.col_1}>
                        <Text style={[globalStyle.heading2, styles.userName]}>{userAuth === "member"? "회원코드" : "트레이너 코드"}</Text>
                        <Text style={[globalStyle.body2, styles.userNameInfo]}>{trainerCode}</Text>
                    </View>
                    <View style={globalStyle.col_1, styles.alignCenter}>
                        <Pressable
                            style={[globalStyle.appbarBtn, globalStyle.buttonGrey, styles.copyBtn]}
                            onPress={copyToClipboard}
                        >
                            <Text style={globalStyle.appbarBtnText}>복사</Text>
                        </Pressable>
                    </View>

                    
                </View>
                <View style={[styles.myPageInfoImg, styles.logOut]}>
                    <Pressable style={styles.BasicBtn}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[globalStyle.body2, styles.BasicBtnText]}>로그아웃</Text>
                    </Pressable>
                </View>
                <View style={[styles.logOut]}>
                    <Text style={globalStyle.textDimmedGrey} >v.1.0</Text>
                </View>
            </ScrollView>
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
    disableText:{
        ...globalStyle.body2,
        opacity:0.3
    },
    barHeader:{
        textAlign:"left",
        width:"100%"
    },
    myPageInfoImg:{
        marginTop:10,
        justifyContent: "center",
        alignItems: "center",
    },
    userImg:{
        justifyContent: "center",
        alignItems: "center",
        margin:"auto",
        width:70,
        height:70,
        borderRadius:50,
        resizeMode: "cover",
        borderWidth:3,
        borderColor:"#E101FF",
        marginBottom:10
    },
    myPageInfo:{
        marginBottom:10,
        marginLeft:20,
        marginRight:20,
        borderBottomWidth:1,
        borderBottomColor:"#eee"
    },
    userName:{
        justifyContent: "center",
        alignItems: "center", 
    },
    userNameInfo:{
        marginBottom:10
    },
    BasicBtn:{
        width:"100%",
        height:60,
        borderRadius:10,
        backgroundColor:"#ffffff",  
        ...globalStyle.buttonGrey,
        borderWidth:1,
        justifyContent: "center",
        alignItems: "center",  
    },
    BasicBtnText:{
        ...globalStyle.button,
        textAlign:"center",
        justifyContent: "center",
        alignItems: "center",
    },
    logOut:{
        justifyContent: "center",
        alignItems: "center",
        margin:20
    },
    alignCenter:{
        justifyContent: "center",
    },
    copyBtn:{
        width:60,
        textAlign: 'center',
        justifyContent: 'center',
    },
    editWidth:{
        width:60,
        textAlign: 'center',
        alignItems: "center",
        justifyContent: 'center',
    },
    trainerBtn:{
        height:94,
        borderRadius:10,
        marginTop:10
    },
    arrow_right:{
        width:30,
        height:30
    },
    padding_Left: {
        paddingLeft:20
    },
    margin_right:{
        marginRight:15
    }
})

