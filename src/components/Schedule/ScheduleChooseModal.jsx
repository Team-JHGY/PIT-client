import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import closeIcon from '../../../assets/icon/Common/closeIcon.svg'
import check from '../../../assets/img/Schedule/check.svg'
import { WithLocalSvg } from 'react-native-svg'
import globalStyle from '../../utils/globalStyle'

import CancelButton from '../Schedule/CancelButton'
import ConfirmButton from '../Schedule/ConfirmButton'
const dummyData = [
  { id: 1, title: '김회원(남, 23세) 수업', isChecked: true, isLast: false },
  { id: 2, title: '정회원(여, 21세) 수업', isChecked: false, isLast: false },
  { id: 3, title: '박회원(여, 45세) 수업', isChecked: false, isLast: false },
  { id: 4, title: '이회원(남, 31세) 수업', isChecked: false, isLast: false },
  { id: 5, title: '비수업 시간', isChecked: false, isLast: true },
]
const ScheduleChooseModal = ({ closeModal, chooseMember, memberIdx, setMemberIdx }) => {
  const [schedules, setSchedules] = useState(dummyData)
  const [tempIdx, setTempIdx] = useState(memberIdx)
  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={globalStyle.heading2}>{'스케쥴 선택'}</Text>
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
          keyExtractor={(item) => item.id.toString()}
          data={schedules}
          renderItem={({ item }) => {
            const memberStyle = (isLast) => {
              if (isLast === true) {
                return {
                  height: 100,
                }
              } else if (isLast === false) {
                return {
                  header: 30,
                }
              }
            }
            return (
              <View style={[styles.memberItem, memberStyle(item.isLast)]}>
                {tempIdx === item.id ? (
                  <View style={styles.selectedMemberBox}>
                    <WithLocalSvg asset={check} />
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      setTempIdx(item.id)
                    }}
                  >
                    <View style={styles.unSelectedMemberBox}></View>
                  </Pressable>
                )}
                <View>
                  <Text style={styles.memberBoxTitle}>{item.title}</Text>
                  {item.isLast === true && (
                    <Text style={styles.lastOption}>회원들이 선생님의 스케쥴을 보았을</Text>
                  )}
                  {item.isLast === true && (
                    <Text style={styles.lastOption}>때 해당 시간대에 일정이 있는 것 처럼</Text>
                  )}
                  {item.isLast === true && <Text style={styles.lastOption}>보입니다.</Text>}
                </View>
              </View>
            )
          }}
          style={{ alignSelf: 'stretch', width: '100%' }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: '15%',
            paddingBottom: '4.54%',
          }}
        >
          <CancelButton clickEvent={closeModal} buttonTitle={'취소'} />
          <ConfirmButton
            chooseMember={chooseMember}
            closeModal={closeModal}
            setMemberIdx={setMemberIdx}
            item={schedules[tempIdx - 1]}
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
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: '7.5%',
    marginTop: 30,
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
  memberBoxTitle: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.15,
    ...globalStyle.body1,
  },
  lastOption: {
    ...globalStyle.body2,
    lineHeight: 19,
    color: '#5A5757',
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
})

export default ScheduleChooseModal
