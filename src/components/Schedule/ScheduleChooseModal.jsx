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
  const [tempMember, setTempMember]   = React.useState(null)
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
          const list = res.data.members
          list.push({name:"비수업 시간", member:{id:"none"}, isLast:true})
          setSchedules(list)
          
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
            
            return (
              <View style={[styles.memberItem]}>
                {tempIdx === item.partnershipId? 
                  (
                    <Pressable
                      onPress={() => {
                        setTempIdx(tempIdx === item.partnershipId? null : item.partnershipId)
                        setTempMember('수업 또는 비수업을 선택해주세요.')
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
                        setTempMember(item.name !== undefined? item.name :`${item.member.user.name}(${item.member.gender === "MAN"? "남":"여"},${new Date().getFullYear() - new Date(item.member.birthday).getFullYear()}세)`)
                      }}
                    >
                      <View style={styles.unSelectedMemberBox}></View>
                    </Pressable>
                  )
                }
                <View>
                  <Text style={styles.memberBoxTitle}>
                    {item.name !== undefined?
                      item.name
                      :
                      `${item.member.user.name}(${item.member.gender === "MAN"? "남":"여"},${new Date().getFullYear() - new Date(item.member.birthday).getFullYear()}세)`
                    }
                    
                  </Text>
                  {item.isLast === true && (
                    <Text style={styles.lastOption}>회원들이 선생님의 스케쥴을 보았을</Text>
                  )}
                  {item.isLast === true && (
                    <Text style={styles.lastOption}>때 해당 시간대에 일정이 있는 것 처럼</Text>
                  )}
                  {item.isLast === true && <Text style={styles.lastOption}>보입니다.</Text>}
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
            setMember={setMember}
            item={choosName}
            id={tempIdx}
            member={tempMember}
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
