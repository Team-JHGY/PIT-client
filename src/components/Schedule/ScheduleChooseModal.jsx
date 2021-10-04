import React from 'react'
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import check from '../../../assets/img/Schedule/check.svg'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'

import CancelButton from '../Schedule/CancelButton'
import ConfirmButton from '../Schedule/ConfirmButton'

import { decode } from 'js-base64';
// context
import { UserContext } from '../../store/user'
import config from "../../utils/config" 



const ScheduleChooseModal = ({ closeModal, setMember, memberIdx, setMemberIdx }) => {
  const [schedules, setSchedules]     = React.useState([])
  const [tempIdx, setTempIdx]         = React.useState(memberIdx)
  const [choosName, setChooseName]    = React.useState()
  const { userState, userDispatch }   = React.useContext(UserContext)
  const splitJwt                      = userState.jwtToken.split(".")
  const userInfo                      = React.useState(JSON.parse(decode(splitJwt[1])))

  React.useEffect(()=>{
    MemberList(userState.jwtToken)
  },[])

  async function MemberList(token) {
    
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
          setSchedules(res.data.members)
          console.log("멤버: ",res.data)
        }else if(res.code === -13){
          setUserData([])
        }
        
        
    })
    .catch((e) => console.log(e))  
    
  }



  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={globalStyle.heading2}>{'스케쥴 선택'}</Text>
          <Pressable
            style={styles.closeIcon}
            onPress={() => {
              closeModal()
            }}
          >
            <WithLocalSvg asset={closeIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <FlatList
          keyExtractor={(item) => String(item.member.id)}
          data={schedules}
          renderItem={({ item }) => {
            const memberStyle = (isLast) => {
              if (isLast === true) {
                return {
                  height: 100,
                }
              } else if (isLast === false) {
                return {
                  header: 30,
                }
              }
            }
            return (
              <View style={[styles.memberItem, memberStyle(item.isLast)]}>
                {tempIdx === item.partnershipId ? 
                  (
                    <Pressable
                      onPress={() => {
                        setTempIdx(tempIdx===item.partnershipId? null : item.partnershipId)
                      }}
                    >
                      <View style={styles.selectedMemberBox}>
                        <WithLocalSvg asset={check} />
                      </View>
                    </Pressable>
                  ) 
                : 
                  (
                    <Pressable
                      onPress={() => {
                        setTempIdx(item.partnershipId)
                        setMember(`${item.member.user.name}(${item.member.gender === "MAN"? "남":"여"},${new Date().getFullYear() - new Date(item.member.birthday).getFullYear()}세)`)
                      }}
                    >
                      <View style={styles.unSelectedMemberBox}></View>
                    </Pressable>
                  )
                }
                <View>
                  <Text style={styles.memberBoxTitle}>
                    {item.member.user.name}

                    (
                      {item.member.gender === "MAN"? "남":"여"}
                      ,
                      {new Date().getFullYear() - new Date(item.member.birthday).getFullYear()}
                    
                    세)
                  </Text>
                  {/*item.isLast === true && (
                    <Text style={styles.lastOption}>회원들이 선생님의 스케쥴을 보았을</Text>
                  )}
                  {item.isLast === true && (
                    <Text style={styles.lastOption}>때 해당 시간대에 일정이 있는 것 처럼</Text>
                  )}
                  {item.isLast === true && <Text style={styles.lastOption}>보입니다.</Text>*/}
                </View>
              </View>
            )
          }}
          style={{ alignSelf: 'stretch', width: '100%' }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: '15%',
            paddingBottom: '4.54%',
          }}
        >
          <CancelButton clickEvent={closeModal} buttonTitle={'취소'} />
          <ConfirmButton
            closeModal={closeModal}
            setMemberIdx={setMemberIdx}
            item={choosName}
            id={tempIdx}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  modalDialog: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    height: '66.6%',
    width: '88.8%',
    alignItems: 'center',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  closeIcon: {
    right: '5%',
    position: 'absolute',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: '7.5%',
    marginTop: 30,
  },
  selectedMemberBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AFF91',
  },
  unSelectedMemberBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: 'solid',
    borderColor: '#C2C7CC',
  },
  memberBoxTitle: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.15,
    ...globalStyle.body1,
  },
  lastOption: {
    ...globalStyle.body2,
    lineHeight: 19,
    color: '#5A5757',
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
})

export default ScheduleChooseModal
