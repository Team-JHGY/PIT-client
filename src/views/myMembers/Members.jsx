import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import NewMembers from './NewMember'
import sortArrow from "../../../assets/sortArrow.png"
import cross from "../../../assets/cross.png"

export default function Members({navigation}) {
    const [appBarArray, setAppBarArray] = React.useState([])
    

    return (
        <>
         <Appbar.Header style={globalStyle.appbarMain}>
            <Appbar.Content title="나의 회원"  titleStyle={globalStyle.heading1}/>
            <Pressable
                style={globalStyle.appbarBtn}
                onPress={()=>navigation.navigate('NewMembers')} 
            >
                <Text style={globalStyle.appbarBtnText}>회원추가</Text>
            </Pressable>
            <Pressable
                style={globalStyle.appbarBtnArrow}
                
            >
                <Image source={sortArrow} style={globalStyle.arrowImg}/>
            </Pressable>
            
        </Appbar.Header>
        <SafeAreaView style={styles.mainForm}>
            <View>
                <Text style={styles.disableText}>등록된 회원이 없습니다.</Text>
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
        justifyContent: "center",
        alignItems: "center"

    },
    disableText:{
        ...globalStyle.body2,
        opacity:0.3
    }
    
})

