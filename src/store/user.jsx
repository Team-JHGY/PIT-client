import React, { createContext, useReducer } from 'react'
import { shouldUseActivityState } from 'react-native-screens'
export const UserContext = createContext()

const initialState = {
  name: '',
  gender: 'MAN',
  birthday: '',
  intro: '',
  accessToken: '',
  refreshToken: '',
  expiresIn: '',
  role: '',
  // 테스트용 필드
  jwtToken: '',
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_MEMBER_NAME':
      return { ...state, name: payload.name }
    case 'SET_MEMBER_GENDER':
      return { ...state, gender: payload.gender }
    case 'SET_MEMBER_BIRTHDAY':
      return { ...state, birthday: payload.birthday }
    case 'SET_MEMBER_INTRO':
      return { ...state, intro: payload.intro }
    case 'SET_MEMBER_TOKEN':
      return {
        ...state,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiresIn: payload.expiresIn,
      }
    case 'SET_ROLE':
      return { ...state, role: payload.role }
    case 'SET_JWT_TOKEN':
      return { ...state, jwtToken: payload.jwtToken }
      break
  }
}
const UserStore = (props) => {
  const [userState, userDispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserStore
