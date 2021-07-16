import React, { useCallback, useEffect, useState } from 'react'
import SignUpStep1 from './SignUpStep1'
import SignUpStep2Trainer from './SignUpStep2Trainer'
import SignUpStep2Member from './SignUpStep2Member'
import ModalDialog from '../../components/SignUp/ModalDialog'
import { View } from 'react-native'

const SignUpView = ({ navigation }) => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [intro, setIntro] = useState('')
  const [isModal, setIsModal] = useState(false)
  const [sex, setSex] = useState('')
  const [birthDay, setBirthDay] = useState('')
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

      {step === 1 && (
        <SignUpStep1
          changeStep={() => {
            setStep(step + 1)
          }}
          setRole={(role) => {
            setRole(role)
          }}
          role={role}
          goBack={() => {
            navigation.goBack()
          }}
          openModal={() => {
            setIsModal(true)
          }}
        />
      )}
      {step === 2 && role === 'trainer' && (
        <SignUpStep2Trainer
          goBackStep={() => {
            setStep(step - 1)
          }}
          setImage={(image) => {
            setImage(image)
          }}
          image={image}
          setName={(name) => {
            setName(name)
          }}
          name={name}
          setIntro={(intro) => {
            setIntro(intro)
          }}
          intro={intro}
          goBack={() => {
            navigation.goBack()
          }}
          openModal={() => {
            setIsModal(true)
          }}
        />
      )}
      {step === 2 && role === 'member' && (
        <SignUpStep2Member
          goBackStep={() => {
            setStep(step - 1)
          }}
          setImage={(image) => {
            setImage(image)
          }}
          image={image}
          setName={(name) => {
            setName(name)
          }}
          name={name}
          setSex={(sex) => {
            setSex(sex)
          }}
          sex={sex}
          setBirthDay={(birthDay) => {
            setBirthDay(birthDay)
          }}
          birthDay={birthDay}
          setIntro={(intro) => {
            setIntro(intro)
          }}
          intro={intro}
          goBack={() => {
            navigation.goBack()
          }}
          openModal={() => {
            setIsModal(true)
          }}
        />
      )}
    </View>
  )
}

export default SignUpView
