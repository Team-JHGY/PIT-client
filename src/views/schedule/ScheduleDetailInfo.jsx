import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image } from 'react-native'
import { Appbar } from 'react-native-paper'

// components
import CancelButton from '../../components/Schedule/CancelButton'
import UpdateButton from '../../components/Schedule/UpdateButton'
import Seperator from '../../components/Schedule/Seperator'
import ModalDialog from '../../components/Common/ModalDialog'
import { getTimeOfDate } from '../../utils/commonFunctions'

// utils
import globalStyle from '../../utils/globalStyle'

// assets
import cross from '../../../assets/cross.png'

// context
import { UserContext } from '../../store/user'
import config from '../../utils/config'
import { decode } from 'js-base64'

//TODO: 총 수업 횟수도 필요할 것으로 보여진다.
//TODO: sequence가 비어있어 api에 추가되어야 된다.
//TODO: 비수업 시간 스케쥴인 경우 API가 화면과 매칭되지 않아 수정되야 된다.

const ScheduleDetailInfo = ({ navigation, route }) => {
  const { userState, userDispatch } = React.useContext(UserContext)
  const splitJwt = userState.jwtToken.split('.')
  const userInfo = React.useState(JSON.parse(decode(splitJwt[1])))
  const { type, id, startAt, endAt, date } = route.params
  const [name, setname] = React.useState()
  const [brith, setBrith] = React.useState()
  const [profile, setProfile] = React.useState(undefined)
  const [end, setEnd] = React.useState(new Date())
  const [start, setStart] = React.useState(new Date())
  const [schedual, setSchedual] = React.useState(0)
  const [sequence, setSequence] = React.useState(0)

  //name, brith, end, start

  //수정
  const [scheduleId, setScheduleId] = React.useState(0)
  // state
  const [isModal, setIsModal] = useState(false)
  const [isNotAvailableModal, setIsNotAvailableModal] = useState(false)

  React.useEffect(() => {
    fetch(`${config.BASE_URL}/schedules/${id}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setScheduleId(res.data.id)
        setname(res.data.partnership.member.user.name)
        setBrith(res.data.partnership.member.birthday)
        setProfile(
          res.data.partnership.member.user.profileImage === null
            ? undefined
            : res.data.partnership.member.user.profileImage.path
        )
        setEnd(res.data.endAt === undefined ? new Date() : new Date(res.data.endAt))
        setStart(res.data.startAt === undefined ? new Date() : new Date(res.data.startAt))
        setSchedual(res.data.scheduleRepeat.count)
        setSequence(res.data.sequence === undefined ? 0 : res.data.sequence)
      })
      .catch((e) => console.log(e))
  }, [])

  async function DeleteSh() {
    await fetch(`${config.BASE_URL}/schedules/${id}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        navigation.goBack()
      })
      .catch((e) => console.log(e))
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          clickEvent={() => {
            // 삭제 api로 변경되어야 함
            DeleteSh()
          }}
          title={'스케쥴 삭제'}
          body={'해당 스케쥴을 삭제합니다.\n회원의 수업 횟수에\n영향을 미칠 수 있으니 유의하세요.'}
          buttonTitle={'삭제하기'}
        />
      )}
      {isNotAvailableModal && (
        <ModalDialog
          closeModal={() => {
            setIsNotAvailableModal(false)
          }}
          clickEvent={() => {
            // 삭제 api로 변경되어야 함
            DeleteSh()
          }}
          title={'스케쥴 삭제'}
          body={'해당 스케쥴을 삭제합니다.'}
          buttonTitle={'삭제하기'}
        />
      )}
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content
          title={'스케쥴 정보'}
          titleStyle={[globalStyle.heading1, globalStyle.center]}
        />

        <Pressable
          style={[globalStyle.header, globalStyle.absoluteRight]}
          onPress={() => navigation.goBack()}
        >
          <Image source={cross} style={globalStyle.title} />
        </Pressable>
      </Appbar.Header>
      {type !== 'notAvailable' ? (
        <View
          style={[globalStyle.row, { marginLeft: '5.55%', marginBottom: 20, alignItems: 'center' }]}
        >
          {profile !== undefined ? (
            <Image source={{ uri: profile }} style={styles.profile} />
          ) : (
            <Image
              style={styles.profile}
              source={require('../../../assets/img/SignUp/emptyProfile.png')}
            />
          )}
          <Text style={[globalStyle.body2, { marginLeft: 10 }]}>
            {name} ({new Date().getFullYear() - new Date(brith).getFullYear()}세) 회원님 수업
          </Text>
        </View>
      ) : (
        <View>
          <Text style={[globalStyle.body2, { marginLeft: '5.55%' }]}>{'비수업 시간'}</Text>
          <Text style={styles.subText_notAvailable}>
            {'회원들이 선생님의 스케쥴을 보았을 때 해당 시간대에\n일정이 있는 것 처럼 보입니다.'}
          </Text>
        </View>
      )}

      <Seperator height={'0.2%'} />
      {type !== 'notAvailable' && (
        <Text style={[globalStyle.heading2, { marginLeft: '5.55%' }]}>{'수업 회차'}</Text>
      )}
      {type !== 'notAvailable' && (
        <Text style={styles.subText}>{`${sequence}번째 수업 (등록된 수업 총 ${
          schedual === null ? 0 : schedual
        }회)`}</Text>
      )}

      <Text style={[globalStyle.heading2, { marginLeft: '5.55%', marginTop: 20 }]}>{'날짜'}</Text>
      <Text style={styles.subText}>
        {type !== 'notAvailable'
          ? start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
          : date.split('T')[0] + 'asdf'}
      </Text>
      <Text style={styles.subText}>
        {type !== 'notAvailable'
          ? `${getTimeOfDate(start)} ~ ${getTimeOfDate(end)}`
          : `${startAt} ~ ${endAt}`}
      </Text>
      {type === 'reserved' && (
        <Pressable>
          <View style={styles.navigateButton}>
            <Text style={globalStyle.body2Bold}>{'회원 수업 날짜로 이동'}</Text>
          </View>
        </Pressable>
      )}

      {type !== 'noUpdate' && (
        <View style={{ marginTop: 'auto', marginBottom: 30, flexDirection: 'row', height: 60 }}>
          <CancelButton
            buttonTitle={'삭제'}
            clickEvent={() => {
              if (type !== 'notAvailable') {
                setIsModal(true)
              } else {
                setIsNotAvailableModal(true)
              }
            }}
          />
          {/*스케쥴  수정 버튼 */}
          <UpdateButton
            clickEvent={() => {
              navigation.navigate('AddSchedule', {
                mode: 'update',
                value: {
                  name:
                    name !== undefined
                      ? `${name} (${
                          new Date().getFullYear() - new Date(brith).getFullYear()
                        }세) 회원님`
                      : '비 수업시간',
                  end,
                  start,
                  scheduleId,
                },
              })
            }}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#11F37E',
  },
  subText: {
    ...globalStyle.body2,
    marginLeft: '5.55%',
    lineHeight: 19,
  },
  navigateButton: {
    marginLeft: '5.55%',
    marginRight: '5.55%',
    marginTop: 25,
    height: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C2C7CC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText_notAvailable: {
    ...globalStyle.body2,
    fontSize: 14,
    lineHeight: 19,
    color: '#5A5757',
    marginLeft: '5.55%',
    marginBottom: 20,
  },
})

export default ScheduleDetailInfo
