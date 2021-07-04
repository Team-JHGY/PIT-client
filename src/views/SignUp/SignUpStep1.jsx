import React, { useCallback, useEffect, useState } from 'react'
import ButtonLarge from '../../components/Common/ButtonLarge'
import { Text, StyleSheet, View, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'
import TrainerCard from '../../components/SignUp/TrainerCard'
import MemberCard from '../../components/SignUp/MemberCard'

const SignUpStep1 = ({ changeStep, setRole, role, goBack, openModal }) => {
  const [buttonEnable, setButtonEnable] = useState('false')
  useEffect(() => {
    if (role !== '') setButtonEnable(true)
  }, [])
  return (
    <View style={styles.body}>
      <Text style={[styles.heading, { marginTop: 95 }]}>안녕하세요!</Text>
      <Text style={styles.heading}>둘 중 어디에 해당하시나요?</Text>
      <View style={styles.cardWrapper}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setRole('trainer')
            setButtonEnable(true)
          }}
        >
          <TrainerCard isChecked={role === 'trainer'} />
        </Pressable>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setRole('member')
            setButtonEnable(true)
          }}
        >
          <MemberCard isChecked={role === 'member'} />
        </Pressable>
      </View>
      <View style={{ marginTop: 25 }}>
        {role === 'trainer' && <Text>트레이너 계정으로 가입하면 회원에게 나의 일정을</Text>}
        {role === 'trainer' && <Text>공유하고, 수업때 회원이 진행한 운동을 기록하고</Text>}
        {role === 'trainer' && <Text>식단과 개인운동에 대한 피드백을 줄 수 있어요.</Text>}
        {role === 'member' && <Text>회원 계정으로 가입하면 트레이너에게 나의 일정을</Text>}
        {role === 'member' && <Text>공유하고, 수업때 회원이 진행한 운동을 기록하고</Text>}
        {role === 'member' && <Text>식단과 개인운동에 대한 피드백을 줄 수 있어요.</Text>}
      </View>
      <ButtonLarge name={'다음'} isEnable={buttonEnable} onPress={changeStep} />
    </View>
  )
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center' },
  cardWrapper: {
    marginTop: 55,
    flexDirection: 'row',
    height: 300,
  },
  heading: { ...globalStyle.heading1 },
  body2: { ...globalStyle.body2 },
})

export default SignUpStep1
