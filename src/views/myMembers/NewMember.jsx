import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable,Image, Modal } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import cross from "../../../assets/cross.png"


export default function NewMembers({navigation}) {
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <>
        {/*네비게이션 형태가 다 달라서 컴포넌트 별 개별 추가 진행*/}
       <Appbar.Header style={globalStyle.titleAppbar}>
            <Appbar.Content title='회원 추가'  titleStyle={globalStyle.heading1}/>
            
            <Pressable
                style={globalStyle.header}
                onPress={()=>navigation.goBack()}
            >
                <Image source={cross} style={globalStyle.title}/>
            </Pressable>
        </Appbar.Header>

        {/* View 부분 */}
        <SafeAreaView style={styles.mainForm}>

            {/*Modal 부분*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}
            >
                <View style={modalstyles.centeredView}>
                <View style={modalstyles.modalView}>
                    <View style={modalstyles.row}>
                        <Text style={[globalStyle.heading2, modalstyles.headerText]}>트레이너 코드 복사</Text>
                        <Pressable
                            style={modalstyles.cross}
                            onPress={()=>setModalVisible(!modalVisible)}
                        >
                            <Image source={cross} style={modalstyles.cross}/>
                        </Pressable>
                    </View>
                    <View style={modalstyles.UserInfo}>

                        
                        <Text style={modalstyles.codeText}>123456</Text>
                        <Text style={globalStyle.body2}>
                            트레이너코드를 클립보드에 
                            복사했습니다. 회원님에게 해당 코드를
                            공유해 트레이너 추가하도록 안내해 
                            주세요.
                        </Text>
                        <Text>어디에서 추가할 수 있나요?</Text>
                        <Text style={[globalStyle.body2, modalstyles.infoText]}>
                            회원님 앱의 마이 &gt; 트레이너 &gt; 
                            트레이너 추가하기 버튼 클릭
                        </Text>

                       

                        <Pressable
                        style={[modalstyles.button, modalstyles.buttonOpen]}
                        onPress={() => setModalVisible(!modalVisible)}
                        >
                        
                            <Text style={[globalStyle.button, modalstyles.btnText]}>코드 복사</Text>
                        </Pressable>

                       
                    </View>
                </View>
                </View>
            </Modal>
            {/*Modal 끝*/}

            
            <View style={styles.viewPadding}>
                <Pressable style={styles.BasicBtn} onPress={() => {
                navigation.navigate('AddMembersCode')
                }}> 
                    <Text style={styles.btnText}>회원코드 입력으로 추가</Text>
                </Pressable>
                <Text style={styles.infoText}>추가하려는 회원님의 앱에서 확인한 회원코드를 등록해 바로 추가합니다.</Text>
                


                <Pressable style={styles.BasicBtn} 
                    onPress={() => setModalVisible(true)}
                > 
                    <Text style={styles.btnText}>트레이너 코드 공유로 추가</Text>
                </Pressable>
                <Text style={styles.infoText}>본인의 트레이너 코드를 회원님에게 공유해, 회원님의 앱에서 해당 코드를 등록해 추가하게 합니다.</Text>
            </View>
        </SafeAreaView>
        
        </>
    )
}

//스타일 가이드 
const styles = StyleSheet.create({
    mainForm: {
        backgroundColor:"#ffff",
        flex: 1,
        
        alignItems: "center"
        
    },
    btnText:{
        ...globalStyle.body2Bold,
        textAlign:"center",
        margin:15
    },
    infoText:{
        ...globalStyle.body2,
        ...globalStyle.textDartGery,
        textAlign:"justify",
        letterSpacing:2.3,
        lineHeight:18,
        marginTop:10,
        marginRight:5,
        marginLeft:5
        
    },
    viewPadding:{
        padding:20,
        
    },
    BasicBtn:{
        height:60,
        textAlign:"center",
        marginTop:42,
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#C2C7CC'
        
    }
    
})

const modalstyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:"rgba(0, 0, 0, 0.4)",
      
    },
    UserInfo:{
        marginTop:30,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
      margin: 10,
      width:"80%",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
        height:60,
        borderRadius: 5,
        padding: 10,
        margin:10
    },
    buttonOpen: {
      backgroundColor: "#2AFF91",
    },
    cross:{
        position:"absolute",
        right:3,
        top:3,
        width:17,
        height:17
    },
    headerText: {
        textAlign:"center",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
    },
    row:{
        flexDirection: "row"
    },
    codeText:{
        fontSize:24,
        marginBottom:34,
    },
    UserImg:{
        margin:"auto",
        width:100,
        height:100,
        borderRadius:50,
        resizeMode: "cover",
        borderWidth:3,
        borderColor:"#11F37E",
        marginBottom:12
    },
    infoText:{
        ...globalStyle.textDartGery,
        textAlign:"left",
    },
    btnText:{
        textAlign:"center",
        marginTop:5
    }
  });



