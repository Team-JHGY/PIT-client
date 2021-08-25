import React from 'react'
import { View, Image, StyleSheet, SafeAreaView, Text, Pressable, ScrollView } from 'react-native'
import { Appbar } from 'react-native-paper'
import cross from '../../../assets/cross.png'
import scheduleEx from '../../../assets/img/Schedule/scheduleEx.png'
import globalStyle from '../../utils/globalStyle'
const ScheduleGuide = ({ navigation }) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Appbar.Content title={'안내'} titleStyle={[globalStyle.heading1, globalStyle.center]} />

        <Pressable
          style={[globalStyle.header, globalStyle.absoluteRight]}
          onPress={() => navigation.goBack()}
        >
          <Image source={cross} style={globalStyle.title} />
        </Pressable>
      </Appbar.Header>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '88.8%' }}>
            <Text style={styles.question}>
              트레이너 선생님의 스케쥴은 왜 회원들에게 공유되나요?
            </Text>
            <Text style={[styles.answer, { marginTop: 10 }]}>
              트레이너 선생님 스케쥴에 등록된 일정들은 등록되어 있는 모든 회원에게 보이게 됩니다.
              이는 회원들이 트레이너 선생님의 스케쥴을 자유롭게 확인하고 비어 있는 시간대를 찾기
              위함입니다.
            </Text>
            <Text style={[styles.question, { marginTop: 30 }]}>
              트레이너 선생님의 스케쥴이 회원들에게 어떻게 보이나요?
            </Text>
            <Text style={[styles.answer, { marginTop: 10 }]}>
              회원계정으로 가입하게 되면 보이는 앱 화면은 트레이너 계정으로 가입한 화면과 다소
              다릅니다. 각 회원들은 트레이너와의 1:1 방 홈에서 선생님의 스케쥴을 확인할 수 있는
              화면에 접근할 수 있습니다.
            </Text>
            <View style={{ alignItems: 'center' }}>
              <Image source={scheduleEx} style={{ marginTop: 20, width: 355, height: 330 }} />
            </View>
            <Text textBreakStrategy="highQuality" style={[styles.answer, { marginTop: 20 }]}>
              {`트레이너 선생님이 등록한 스케쥴들은 여기에 노출됩니다. 수업 스케쥴 뿐 아니라 비수업시간으로 등록한 시간도 보여지며, 다만 어떤 회원의 수업인지 혹은 비수업시간인지 여부는 보여지지 않습니다. 회원은 등록된 스케쥴만을 보고 선생님의 비어있는 시간대를 추측, 수업시간 등록 및 변경을 요청하시면 됩니다.\n(회원 측에서 스케쥴 등록이나 수정을 할 수 는 없습니다. 메신저나 구두로 요청해서 선생님이 직접 스케쥴을 등록해주셔야 합니다.)\n\n\n`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  question: {
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 23,
  },
  answer: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    color: '#5A5757',
  },
})
export default ScheduleGuide
