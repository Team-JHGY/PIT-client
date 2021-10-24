import React, { useContext } from 'react'
import { View, StyleSheet, Pressable, Text, TextInput } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

// utils
import globalStyle from '../../utils/globalStyle'
import config from '../../utils/config'

// assets
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'

// components
import CancelButton from '../../components/Schedule/CancelButton'
import PTGoalConfirmButton from './PTGoalConfirmButton'

// store
import { UserContext } from '../../store/user'

const PTGoalUpdateModal = ({ closeModal, partnershipId, goalText }) => {
  const { userState, userDispatch } = useContext(UserContext)
  const [text, setText] = React.useState(goalText)

  const updateTrainerGoal = async () => {
    let bodyForm = {
      goalText: String(text),
    }

    await fetch(`${config.BASE_URL}/partnerships/goal/${partnershipId}/trainer`, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyForm),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 0) {
          console.log('update fail')
        }
      })
      .catch((e) => console.log(e))
  }

  const updateMemberGoal = async () => {
    let bodyForm = {
      goalText: String(text),
    }

    await fetch(`${config.BASE_URL}/partnerships/goal/${partnershipId}/member`, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyForm),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
      })
      .catch((e) => console.log(e))
  }
  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={globalStyle.heading2}>{'PT목표 편집'}</Text>
          <Pressable
            style={styles.closeIcon}
            onPress={() => {
              closeModal()
            }}
          >
            <WithLocalSvg asset={closeIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <Text style={styles.subTitle}>{'PT목표'}</Text>
        <TextInput
          style={styles.editBox}
          onChangeText={setText}
          value={text}
          multiline={true}
        ></TextInput>
        <View
          style={{
            flexDirection: 'row',
            height: '15%',
            marginTop: '4.65%',
          }}
        >
          <CancelButton clickEvent={closeModal} buttonTitle={'취소'} />
          <PTGoalConfirmButton
            closeModal={closeModal}
            callBackFunction={() => {
              if (userState.role === 'member') {
                updateMemberGoal()
              } else {
                updateTrainerGoal()
              }
            }}
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
    height: '60%',
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
  subTitle: {
    alignSelf: 'stretch',
    marginTop: 5,
    ...globalStyle.heading2,
    marginLeft: '4.68%',
  },
  editBox: {
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C2C7CC',
    width: '88.8%',
    height: '55.81%',
    textAlignVertical: 'top',
  },
})

export default PTGoalUpdateModal
