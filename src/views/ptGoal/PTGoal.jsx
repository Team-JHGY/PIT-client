import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, Pressable, Image, SafeAreaView } from 'react-native'
import { Appbar } from 'react-native-paper'

// utils
import globalStyle from '../../utils/globalStyle'
import config from '../../utils/config'

// assets
import cross from '../../../assets/cross.png'
import arrow_left from '../../../assets/arrow_left.png'
import goal from '../../../assets/img/Schedule/goal.png'
import emptyProfile from '../../../assets/img/SignUp/emptyProfile.png'

// context
import { UserContext } from '../../store/user'

// components
import ButtonSmall from '../../components/Common/ButtonSmall'
import Seperator from '../../components/Schedule/Seperator'
import PTGoalUpdateModal from './PTGoalUpdateModal'

const PTGoal = ({ navigation, route }) => {
  // route
  let routeMsg = null

  if (route.params !== undefined) {
    routeMsg = route.params
  }
  let memberProfile = routeMsg.memberProfile
  let trainerProfile = routeMsg.trainerProfile
  let partnershipId = routeMsg.partnershipId
  let memberName = routeMsg.memberName
  let trainerName = routeMsg.trainerName
  // store
  const { userState, userDispatch } = React.useContext(UserContext)

  // state
  const [isPTGoalUpdateModal, setIsPTGoalUpdateModal] = useState(false)
  const [memberGoal, setMemberGoal] = useState(null)
  const [trainerGoal, setTrainerGoal] = useState(null)

  const getGoals = async () => {
    await fetch(`${config.BASE_URL}/partnerships/goal/${partnershipId}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        Authorization: userState.jwtToken,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          if (res.data.memberGoal !== null) {
            setMemberGoal(res.data.memberGoal)
          }
          if (res.data.trainerGoal !== null) {
            setTrainerGoal(res.data.trainerGoal)
          }
        }
      })
      .catch((e) => console.log(e))
  }
  useEffect(() => {
    getGoals()
  }, [memberGoal, trainerGoal, isPTGoalUpdateModal])
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {isPTGoalUpdateModal && (
        <PTGoalUpdateModal
          closeModal={() => {
            setIsPTGoalUpdateModal(false)
          }}
          partnershipId={partnershipId}
          goalText={userState.role === 'MEMBER' ? memberGoal : trainerGoal}
        />
      )}
      <Appbar.Header style={[globalStyle.titleAppbar]}>
        <Pressable
          style={[globalStyle.iconSize, globalStyle.absolute]}
          onPress={() => navigation.goBack()}
        >
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content title={'PT 목표'} titleStyle={[globalStyle.header, globalStyle.center]} />
      </Appbar.Header>
      <View style={styles.subTitle}>
        <Image source={goal} style={{ width: '5.55%', height: '27.7%' }} />
        <Text style={styles.subTitleText}>선생님과 함께하는 PT수업의 목표를 기록해보세요.</Text>
      </View>
      <View style={{ marginTop: 10, marginBottom: 30 }}>
        <View style={styles.buttonWrapper}>
          <Text style={[globalStyle.body1, { lineHeight: 50 }]}>{`${memberName} 회원님`}</Text>
          {userState.role === 'MEMBER' ? (
            <ButtonSmall
              name={' 편집 '}
              customStyle={styles.button}
              onPress={() => {
                setIsPTGoalUpdateModal(true)
              }}
            />
          ) : null}
        </View>
        <View style={styles.profile_goal_view}>
          <Image
            style={[styles.userImg, { borderColor: '#11F37E' }]}
            source={
              memberProfile !== emptyProfile
                ? {
                    uri: memberProfile,
                  }
                : memberProfile
            }
          />
          <Text style={memberGoal === null ? styles.emptyGoalText : styles.goalText}>
            {memberGoal === null ? '등록된 목표가 없습니다.' : memberGoal}
          </Text>
        </View>
      </View>
      <Seperator height={'0.15%'} />
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <View style={styles.buttonWrapper}>
          <Text style={[globalStyle.body1, { lineHeight: 50 }]}>{`${trainerName} T`}</Text>
          {userState.role === 'TRAINER' ? (
            <ButtonSmall
              name={' 편집 '}
              customStyle={styles.button}
              onPress={() => {
                setIsPTGoalUpdateModal(true)
              }}
            />
          ) : null}
        </View>
        <View style={styles.profile_goal_view}>
          <Image
            style={[styles.userImg]}
            source={
              trainerProfile !== emptyProfile
                ? {
                    uri: trainerProfile,
                  }
                : trainerProfile
            }
          />
          <Text style={trainerGoal === null ? styles.emptyGoalText : styles.goalText}>
            {trainerGoal === null ? '등록된 목표가 없습니다.' : trainerGoal}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  subTitle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: '10%',
    alignItems: 'center',
    paddingLeft: '5.55%',
    paddingRight: '5.55%',
  },
  subTitleText: {
    ...globalStyle.body2,
    lineHeight: 19,
    color: '#5A5757',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '5.55%',
    marginRight: '5.55%',
  },
  button: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C2C7CC',
    borderRadius: 6,
  },
  profile_goal_view: {
    flexDirection: 'row',
    marginLeft: '5.55%',
    marginRight: '5.55%',
    alignItems: 'center',
  },
  emptyGoalText: {
    ...globalStyle.body2,
    color: '#A6ACB2',
    lineHeight: 19,
    marginLeft: 10,
  },
  goalText: {
    ...globalStyle.body2,
    lineHeight: 19,
    marginLeft: 10,
    color: '#000000',
  },
  userImg: {
    width: 44,
    height: 44,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E101FF',
    resizeMode: 'cover',
    marginRight: 12,
  },
})
export default PTGoal
