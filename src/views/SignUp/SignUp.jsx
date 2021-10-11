import React, { useCallback, useEffect, useState } from 'react'
import SignUpStep1 from './SignUpStep1'
import SignUpStep2 from './SignUpStep2'
import ModalDialog from '../../components/Common/ModalDialog'

import { View } from 'react-native'

const SignUpView = ({ navigation }) => {
  const [step, setStep] = useState(1)
  const [isModal, setIsModal] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {isModal && (
        <ModalDialog
          closeModal={() => {
            setIsModal(false)
          }}
          clickEvent={() => {
            navigation.goBack()
          }}
          title={'회원가입 취소'}
          body={'회원가입을 취소하고 나가시겠어요?\n모든 데이터가 지워질 수 있어요.'}
          buttonTitle={'회원가입 취소하기'}
        />
      )}
      {/*트레이너 파트 */}
      {step === 1 && (
        <SignUpStep1
          changeStep={() => {
            setStep(step + 1)
          }}
          goBack={() => {
            navigation.goBack()
          }}
          openModal={() => {
            setIsModal(true)
          }}
        />
      )}
      {/*회원 파트 */}
      {step === 2 && (
        <SignUpStep2
          goBackStep={() => {
            setStep(step - 1)
          }}
          goBack={() => {
            navigation.goBack()
          }}
          openModal={() => {
            setIsModal(true)
          }}
          navigation={navigation}
        />
      )}
    </View>
  )
}

export default SignUpView
