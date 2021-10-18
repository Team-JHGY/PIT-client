import React from 'react'
import { Text, StyleSheet, View, Pressable, Image, SafeAreaView } from 'react-native'
import { Appbar } from 'react-native-paper'

// utils
import globalStyle from '../../utils/globalStyle'

// assets
import cross from '../../../assets/cross.png'
import arrow_left from '../../../assets/arrow_left.png'
import goal from '../../../assets/img/Schedule/goal.png'

// context
import { UserContext } from '../../store/user'

// components
import ButtonSmall from '../../components/Common/ButtonSmall'

const PTGoal = ({ navigation, route }) => {
  const { userState, userDispatch } = React.useContext(UserContext)

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
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
      <View>
        <View style={styles.buttonWrapper}>
          <Text style={{ alignItems: 'center' }}>김회원 회원님</Text>
          {userState.role === 'member' ? <ButtonSmall name={'편집'} /> : null}
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
  },
})
export default PTGoal
