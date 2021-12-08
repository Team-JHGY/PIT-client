import React, {useContext } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Pressable, Image,ScrollView } from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper';
import sortArrow from "../../../assets/sortArrow.png"
//import cross from "../../../assets/cross.png"
import { decode } from 'js-base64';

// context
import { UserContext } from '../../store/user'
import config from "../../utils/config" 


export default function Members({navigation}) {
    //const [appBarArray, setAppBarArray] = React.useState([])
    //const [userCount, setUserCount]     = React.useState(1);
    //const [isNew, setIsNew]             = React.useState("Y");
    const [userData, setUserData]       = React.useState([])
    //const [reloadFunc, setReload]       = React.useState("true")
    const { userState, userDispatch }   = useContext(UserContext)
    const splitJwt                      = userState.jwtToken.split(".")
    const userInfo                      = React.useState(JSON.parse(decode(splitJwt[1])))


    React.useEffect(()=>{
        MemberList(userState.jwtToken)
    },[])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            MemberList(userState.jwtToken)
        });
        return unsubscribe;
    }, [navigation]);

    

    async function MemberList(token) {
        if(userInfo[0].type === "TRAINER"){
            await fetch(`${config.BASE_URL}/partnerships/${userInfo[0].sub}/members`,{
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
                    setUserData(res.data.members)
                }else if(res.code === -13){
                    setUserData([])
                }
                
                
            })
            .catch((e) => console.log(e))  
        }else{
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
                            <Pressable key={index} onPress={()=> navigation.navigate('Main',{memberInfo:item})} >
                                <View style={[globalStyle.row, styles.userInfo]}>
                                    <View>
                                        {item.member.user.profileImage !== null ? (
                                            <Image source={{ uri: item.member.user.profileImage.path }} style={styles.userImg} />
                                        ) : (
                                            <Image
                                            style={styles.userImg}
                                            source={require('../../../assets/img/SignUp/emptyProfile.png')}
                                            ></Image>
                                        )}
                                        
                                    </View>
                                    
                                    <View style={globalStyle.col_2}>
                                        <Text style={[globalStyle.body2,styles.textmargin]}>
                                            {userInfo[0].type === "TRAINER"?

                                                item.member.user.name
                                                :   
                                                item.trainer.user.name
                                            } 
                                            (
                                                {userInfo[0].type === "TRAINER"?
                                                
                                                    item.member.gender === "MAN"? "남":"여"
                                                    :
                                                    item.trainer.gender === "MAN"? "남":"여"
                                                }
                                                ,
                                                {userInfo[0].type === "TRAINER"?
                                                
                                                    new Date().getFullYear() - new Date(item.member.birthday).getFullYear()
                                                    :
                                                    new Date().getFullYear() - new Date(item.trainer.birthday).getFullYear()
                                                
                                                }세 
                                            )
                                        </Text>
                                        <Text style={[globalStyle.body2, globalStyle.textDartGery,styles.textmargin]}>
                                            {userInfo[0].type === "TRAINER"?

                                                item.member.modifedAt === null? "null": item.member.modifedAt.split("T")[0].replace(/-/gi, ".")
                                                :
                                                item.trainer.modifedAt === null? "null": item.trainer.modifedAt.split("T")[0].replace(/-/gi, ".")
                                            }
                                        </Text>
                                    </View>
                                    {userInfo[0].type === "TRAINER"?
                                        
                                        item.member.modifedAt !== null && 
                                        new Date().getFullYear() === new Date(item.member.modifedAt).getFullYear() && 
                                        new Date().getMonth() === new Date(item.member.modifedAt).getMonth() && 
                                        new Date().getDate() === new Date(item.member.modifedAt).getDate() ? 
                                        <>
                                        <View style={styles.newMark}>
                                            <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.newMarkText]}>
                                                N
                                            </Text>
                                        </View>
                                        <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date, styles.greenText,styles.textmargin]}>
                                            {item.member.modifedAt === null? "null": item.member.modifedAt.split("T")[0].replace(/-/gi, ".").slice(5)}
                                        </Text>
                                        </>
                                        :<Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date]}>
                                            {item.member.modifedAt === null? "null": item.member.modifedAt.split("T")[0].replace(/-/gi, ".").slice(5)}
                                        </Text>

                                        :
                                        
                                        item.trainer.modifedAt !== null && 
                                        new Date().getFullYear() === new Date(item.trainer.modifedAt).getFullYear() && 
                                        new Date().getMonth() === new Date(item.trainer.modifedAt).getMonth() && 
                                        new Date().getDate() === new Date(item.trainer.modifedAt).getDate() ? 
                                        <>
                                        <View style={styles.newMark}>
                                            <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.newMarkText]}>
                                                N
                                            </Text>
                                        </View>
                                        <Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date, styles.greenText,styles.textmargin]}>
                                            {item.trainer.modifedAt === null? "null": item.trainer.modifedAt.split("T")[0].replace(/-/gi, ".").slice(5)}
                                        </Text>
                                        </>
                                        :<Text style={[globalStyle.body2, globalStyle.textDimmedGrey, styles.date]}>
                                            {item.trainer.modifedAt === null? "null": item.trainer.modifedAt.split("T")[0].replace(/-/gi, ".").slice(5)}
                                        </Text>
                                    }
                                    
                                </View>
                            </Pressable>
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

