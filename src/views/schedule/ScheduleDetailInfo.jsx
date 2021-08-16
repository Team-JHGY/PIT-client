import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Pressable, Image } from 'react-native'
import { Appbar } from 'react-native-paper'

// components
import CancelButton from '../../components/Schedule/CancelButton'
import UpdateButton from '../../components/Schedule/UpdateButton'
import Seperator from '../../components/Schedule/Seperator'
import ModalDialog from '../../components/Common/ModalDialog'

// utils
import globalStyle from '../../utils/globalStyle'

// assets
import cross from '../../../assets/cross.png'

const ScheduleDetailInfo = ({ navigation, route }) => {
  const { type } = route.params

  // state
  const [isModal, setIsModal] = useState(false)
  const [isNotAvailableModal, setIsNotAvailableModal] = useState(false)
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          clickEvent={() => {
            // 삭제 api로 변경되어야 함
            navigation.goBack()
          }}
          title={'스케줄 삭제'}
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
            navigation.goBack()
          }}
          title={'스케줄 삭제'}
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
          <Image
            style={styles.profile}
            source={{
              uri: 'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg',
            }}
          />
          <Text style={[globalStyle.body2, { marginLeft: 10 }]}>
            {'김회원(남, 21세) 회원님 수업'}
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
        <Text style={styles.subText}>{'1번째 수업 (등록된 수업 총 10회)'}</Text>
      )}

      <Text style={[globalStyle.heading2, { marginLeft: '5.55%', marginTop: 20 }]}>{'날짜'}</Text>
      <Text style={styles.subText}>{'2021.07.13(목)'}</Text>
      <Text style={styles.subText}>{'오전 9:00 ~ 오전 10:00'}</Text>
      {type !== 'notAvailable' && (
        <Pressable>
          <View style={styles.navigateButton}>
            <Text style={globalStyle.body2Bold}>{'회원 수업 날짜로 이동'}</Text>
          </View>
        </Pressable>
      )}

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
        <UpdateButton
          clickEvent={() => {
            navigation.navigate('AddSchedule', { mode: 'update' })
          }}
        />
      </View>
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