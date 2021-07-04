import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import globalStyle from '../../utils/globalStyle'


export default function MyPage({navigation}) {
    const [appBarArray, setAppBarArray] = React.useState([])
    

    return (
        <>
        <SafeAreaView style={styles.mainForm}>
            <View>
                <Text style={styles.disableText}>마이페이지</Text>
                <Pressable onPress={()=>navigation.navigate('NewMembers')}>
                    <Text>마이페이지</Text>
                </Pressable>
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


