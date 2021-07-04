import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import ButtonLarge from '../Common/ButtonLarge'
import globalStyle from '../../utils/globalStyle'
import CloseIcon from '../../../assets/icon/Common/closeIcon.svg'
export default ModalDialog = ({ closeModal }) => {
  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={styles.heading2}>회원가입 취소</Text>
          <Pressable style={styles.closeIcon} onPress={closeModal}>
            <WithLocalSvg asset={CloseIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>회원가입을 취소하고 나가시겠어요?</Text>
          <Text style={styles.text}>모든 데이터가 지워질 수 있어요.</Text>
        </View>

        <ButtonLarge name={'회원가입 취소하기'} isEnable={true}></ButtonLarge>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    left: 0,
    paddingLeft: 50,
    paddingRight: 50,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
  },
  modalDialog: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: '35%',
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  heading2: {
    ...globalStyle.heading2,
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
  text: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  textWrapper: {
    marginTop: 25,
    marginBottom: 22,
  },
})
