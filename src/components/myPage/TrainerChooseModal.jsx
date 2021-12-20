// libraries
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'

// components
import CancelButton from '../Schedule/CancelButton'
import ConfirmButton from './ConfirmButton'

// utils
import globalStyle from '../../utils/globalStyle'
import config from '../../utils/config'

// assets
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import checkIcon from '../../../assets/img/Schedule/check.svg'

// context
import { UserContext } from '../../store/user'

export const TrainerChooseModal = ({ trainers, trainerIdx, prevPartnerId, closeModal }) => {
  const { userState, userDispatch } = React.useContext(UserContext)

  const [tempIdx, setTempIdx] = useState(trainerIdx)
  const [newPartnershipId, setNewPartnershipId] = useState(prevPartnerId)
  // useEffect(() => {}, [])

  // fetch(`${config.BASE_URL}/partnerships/${4}/enable`, {
  //   method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
  //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: 'include', // include, *same-origin, omit
  //   headers: {
  //     Authorization: userState.jwtToken,
  //     'Content-Type': 'application/json',
  //   },
  // })

  async function ChangeTrainer(partnershipId) {
    await fetch(`${config.BASE_URL}/partnerships/${prevPartnerId}/disable`, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('first')
        console.log(res)
        return new Promise((resolve, reject) => {
          if (res.code === 0) resolve()
          else reject(res.status)
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .then(async () => {
        return await fetch(`${config.BASE_URL}/partnerships/${partnershipId}/enable`, {
          method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'include', // include, *same-origin, omit
          headers: {
            Authorization: userState.jwtToken,
            'Content-Type': 'application/json',
          },
        })
      })
      .then((res) => res.json())
      .then((res) => {})
      .catch((e) => console.log(e))
  }

  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={globalStyle.heading2}>{'현재 트레이너 설정'}</Text>
          <Pressable
            style={styles.closeIcon}
            onPress={() => {
              closeModal()
            }}
          >
            <WithLocalSvg asset={closeIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <FlatList
          data={trainers}
          keyExtractor={(item) => item.trainer.user.profileImage.path}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.memberItem}>
                {index === tempIdx ? (
                  <Pressable
                    onPress={() => {
                      setTempIdx(index)
                      setNewPartnershipId(item.partnershipId)
                    }}
                  >
                    <View style={styles.selectedMemberBox}>
                      <WithLocalSvg asset={checkIcon} />
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setTempIdx(index)
                      setNewPartnershipId(item.partnershipId)
                    }}
                  >
                    <View style={styles.unSelectedMemberBox}></View>
                  </Pressable>
                )}
                <View>
                  <Text style={styles.memberBoxTitle}>{`${item.trainer.user.name} T`}</Text>
                </View>
              </View>
            )
          }}
          style={{ alignSelf: 'stretch', width: '100%' }}
        />
        <View style={styles.buttonWrapper}>
          <CancelButton clickEvent={closeModal} buttonTitle={'취소'} />
          <ConfirmButton
            buttonTitle={'확인'}
            closeModal={closeModal}
            clickEvent={async () => {
              if (newPartnershipId !== prevPartnerId) {
                await ChangeTrainer(newPartnershipId)
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
    position: 'absolute',
    height: '66.6%',
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
  buttonWrapper: {
    flexDirection: 'row',
    height: '15%',
    paddingBottom: '4.54%',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: '7.5%',
    marginTop: 30,
  },
  memberBoxTitle: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.15,
    ...globalStyle.body1,
  },
  selectedMemberBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AFF91',
  },
  unSelectedMemberBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: 'solid',
    borderColor: '#C2C7CC',
  },
})
