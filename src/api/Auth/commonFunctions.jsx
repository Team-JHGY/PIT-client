// libaries
import { decode } from 'js-base64'

// utils
import config from '../../utils/config'
export async function initializeUserInfo({ userDispatch, jwtToken }) {
  userDispatch({
    type: 'SET_JWT_TOKEN',
    payload: { jwtToken: jwtToken },
  })

  const userId = JSON.parse(decode(jwtToken.split('.')[1])).sub
  const userDataRes = await fetch(`${config.BASE_URL}/users/${userId}`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include',
    headers: {
      Authorization: jwtToken,
      'Content-Type': 'application/json',
    },
  })
  const userDataResJson = await userDataRes.json()
  if (userDataResJson.code === 0) {
    userDispatch({
      type: 'SET_ROLE',
      payload: { role: userDataResJson.data.type },
    })

    userDispatch({
      type: 'SET_MEMBER_NAME',
      payload: { name: userDataResJson.data.name },
    })

    userDispatch({
      type: 'SET_PROFILE',
      payload: { profile: userDataResJson.data.profileImage.path },
    })

    if (userDataResJson.type === 'MEMBER') {
      const memberDataRes = await fetch(`${config.BASE_URL}/members/${userId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          Authorization: jwtToken,
          'Content-Type': 'application/json',
        },
      })

      const memberDataResJson = await memberDataRes.json()
      if (memberDataResJson.code === 0) {
        userDispatch({
          type: 'SET_MEMBER_GENDER',
          payload: { gender: memberDataResJson.data.gender },
        })
        userDispatch({
          type: 'SET_MEMBER_BIRTHDAY',
          payload: { birthday: memberDataResJson.data.birthday },
        })
      }
    }
  } else {
    console.log('/user/{userId} API 호출 실패')
    console.log(userDataResJson)
  }
}
