import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable,Image,ScrollView } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';

export default function MyPage({navigation}) {
    const [appBarArray, setAppBarArray] = React.useState([])
    

    return (
        <>
        <Appbar.Header style={globalStyle.appbarMain}>
            <Appbar.Content title="마이"  titleStyle={[globalStyle.heading1, styles.barHeader]}/>
            <Pressable
                style={[globalStyle.appbarBtn, globalStyle.buttonGrey, styles.editWidth]}
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
                <View style={[styles.myPageInfo]}>
                    <Text style={[globalStyle.heading2, styles.userName]}>이름</Text>
                    <Text style={[globalStyle.body2, styles.userNameInfo]}>김태리</Text>
                </View>
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
                        <Text style={[globalStyle.heading2, styles.userName]}>트레이너 코드</Text>
                        <Text style={[globalStyle.body2, styles.userNameInfo]}>123456</Text>
                    </View>
                    <View style={globalStyle.col_1, styles.alignCenter}>
                        <Pressable
                            style={[globalStyle.appbarBtn, globalStyle.buttonGrey, styles.copyBtn]}
                            onPress={()=>navigation.navigate('NewMembers')} 
                        >
                            <Text style={globalStyle.appbarBtnText}>복사</Text>
                        </Pressable>
                    </View>

                    
                </View>
                <View style={[styles.myPageInfoImg, styles.logOut]}>
                    <Pressable style={styles.BasicBtn}
                        //onPress={() => setModalVisible(true)}
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
        marginTop:14,
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
        marginBottom:12
    },
    myPageInfo:{
        marginBottom:14,
        marginLeft:20,
        marginRight:20,
        borderBottomWidth:1,
        borderBottomColor:"#eee"
    },
    userName:{
        marginBottom:14
    },
    userNameInfo:{
        marginBottom:14
    },
    BasicBtn:{
        width:"100%",
        height:60,
        borderRadius:10,
        backgroundColor:"#ffffff",  
        ...globalStyle.buttonGrey,
        borderWidth:1  
    },
    BasicBtnText:{
        ...globalStyle.button,
        textAlign:"center",
        marginTop:15
    },
    logOut:{
        justifyContent: "center",
        alignItems: "center",
        margin:20
    },
    alignCenter:{
        justifyContent: "center",
        alignItems: "center",
    },
    copyBtn:{
        width:60
    },
    editWidth:{
        width:60
    }
})

