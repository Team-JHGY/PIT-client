import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { WithLocalSvg } from 'react-native-svg'
import ButtonLarge from './ButtonLarge'
import globalStyle from '../../utils/globalStyle'
import CloseIcon from '../../../assets/icon/Common/closeIcon.svg'

const ModalDialog = ({ closeModal, clickEvent, title, body, buttonTitle }) => {
  return (
    <View style={styles.body}>
      <View style={styles.modalDialog}>
        <View style={styles.header}>
          <Text style={styles.heading2}>{title}</Text>
          <Pressable style={styles.closeIcon} onPress={closeModal}>
            <WithLocalSvg asset={CloseIcon}></WithLocalSvg>
          </Pressable>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{body}</Text>
        </View>

        <ButtonLarge name={buttonTitle} isEnable={true} onPress={clickEvent}></ButtonLarge>
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
    lineHeight: 22,
    color: '#5A5757',
    textAlign: 'center',
  },
  textWrapper: {
    marginTop: 25,
    marginBottom: 22,
  },
})

export default ModalDialog
