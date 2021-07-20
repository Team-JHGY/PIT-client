import React, { useEffect, useState } from 'react'
import ButtonLarge from '../../components/Common/ButtonLarge'
import { Text, StyleSheet, View, Pressable, AsyncStorage } from 'react-native'

import { WithLocalSvg } from 'react-native-svg'
import { Appbar } from 'react-native-paper'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import globalStyle from '../../utils/globalStyle'
import TrainerCard from '../../components/SignUp/TrainerCard'
import MemberCard from '../../components/SignUp/MemberCard'

export default function SignUpStep1(props) {
  //changeStep 은 숫자
  const [buttonEnable, setButtonEnable] = useState('false')
  const { changeStep, goBack, openModal } = props
  const [role, setRole] = useState('')

  useEffect(() => {
    if (role !== '') setButtonEnable(true)
  }, [])

  return (
    <>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Pressable
          style={(globalStyle.header, { marginLeft: 'auto', paddingRight: 20 })}
          onPress={() => openModal()}
        >
          <WithLocalSvg asset={closeIcon} />
        </Pressable>
      </Appbar.Header>
      <View style={styles.body}>
        <Text style={[styles.heading, { marginTop: 4 }]}>안녕하세요!</Text>
        <Text style={styles.heading}>둘 중 어디에 해당하시나요?</Text>
        <View style={styles.cardWrapper}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              setRole('trainer')
              setButtonEnable(true)
              AsyncStorage.setItem('userAuth', 'trainer')
            }}
          >
            <TrainerCard isChecked={role === 'trainer'} />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              setRole('member')
              setButtonEnable(true)
              AsyncStorage.setItem('userAuth', 'member')
            }}
          >
            <MemberCard isChecked={role === 'member'} />
          </Pressable>
        </View>
        <View style={styles.description}>
          {role === 'trainer' && (
            <Text style={styles.text}>트레이너 계정으로 가입하면 회원에게 나의 일정을</Text>
          )}
          {role === 'trainer' && (
            <Text style={styles.text}>공유하고, 수업때 회원이 진행한 운동을 기록하고</Text>
          )}
          {role === 'trainer' && (
            <Text style={styles.text}>식단과 개인운동에 대한 피드백을 줄 수 있어요.</Text>
          )}
          {role === 'member' && (
            <Text style={styles.text}>회원 계정으로 가입하면 선생님의 일정을 확인할 수</Text>
          )}
          {role === 'member' && (
            <Text style={styles.text}>있고, 수업때 진행한 운동리스트 확인과 개인운동</Text>
          )}
          {role === 'member' && (
            <Text style={styles.text}>및 식단에 대한 피드백을 받아볼 수 있어요.</Text>
          )}
        </View>
        <ButtonLarge name={'다음'} isEnable={buttonEnable} onPress={changeStep} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center' },
  cardWrapper: {
    marginTop: 60,
    flexDirection: 'row',
    height: 300,
    width: '88.8%',
  },
  heading: { ...globalStyle.heading1 },
  body2: { ...globalStyle.body2 },
  description: {
    width: '88.8%',
    marginTop: 25,
  },
  text: {
    ...globalStyle.body2,
    fontSize: 15,
    lineHeight: 20,
    color: '#5A5757',
  },
})
