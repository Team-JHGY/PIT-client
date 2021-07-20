import React, { useCallback, useEffect, useState } from 'react'
import SignUpStep1 from './SignUpStep1'
import SignUpStep2 from './SignUpStep2'
import ModalDialog from '../../components/SignUp/ModalDialog'
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
          goBackPage={() => {
            navigation.goBack()
          }}
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
          onPress={() => {
            navigation.navigate('Home')
          }}
        />
      )}
    </View>
  )
}

export default SignUpView
