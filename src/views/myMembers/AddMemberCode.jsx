import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  Modal,
} from 'react-native'
import globalStyle from '../../utils/globalStyle'
import { Appbar } from 'react-native-paper'
import arrow_left from '../../../assets/arrow_left.png'
import cross from '../../../assets/cross.png'

export default function AddMembersCode({ navigation }) {
  const [text, onChangeText] = React.useState()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      {/*네비게이션 형태가 다 달라서 컴포넌트 별 개별 추가 진행*/}
      <Appbar.Header style={globalStyle.titleAppbar}>
        <Pressable style={globalStyle.header} onPress={() => navigation.goBack()}>
          <Image source={arrow_left} style={globalStyle.title} />
        </Pressable>
        <Appbar.Content title="회원코드 입력으로 추가" titleStyle={globalStyle.header} />
      </Appbar.Header>

      {/* View 부분 */}
      <SafeAreaView style={styles.mainForm}>
        <View style={styles.viewPadding}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <View style={modalstyles.centeredView}>
              <View style={modalstyles.modalView}>
                <View style={modalstyles.row}>
                  <Text style={[globalStyle.heading2, modalstyles.headerText]}>회원확인</Text>
                  <Pressable
                    style={modalstyles.cross}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Image source={cross} style={modalstyles.cross} />
                  </Pressable>
                </View>
                <View style={modalstyles.UserInfo}>
                  <Image
                    source={{
                      uri: 'https://img.sbs.co.kr/newsnet/etv/upload/2021/04/23/30000684130_500.jpg',
                    }}
                    style={modalstyles.UserImg}
                  />

                  <Text style={globalStyle.heading2}>김태리</Text>
                  <Text style={globalStyle.body2}>(여, ??세)</Text>
                  <Text style={[globalStyle.body2, modalstyles.infoText]}>
                    추가하려는 회원님이 맞는지 확인해주세요.
                  </Text>

                  <View style={modalstyles.row}>
                    <Pressable
                      style={[modalstyles.button, modalstyles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text
                        style={[globalStyle.textDarkRed, globalStyle.button, modalstyles.btnText]}
                      >
                        취소
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[modalstyles.button, modalstyles.buttonOpen]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={[globalStyle.button, modalstyles.btnText]}>확인</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Text style={globalStyle.heading2}>회원 코드</Text>
          <TextInput style={styles.input} onChangeText={onChangeText} value={text} />

          <Text style={styles.infoText}>
            추가하려는 회원님의 앱에서 마이 &gt; 회원코드에서 회원코드를 확인할 수 있습니다.
          </Text>
        </View>
        <View style={styles.BottomBtnMainForm}>
          <Pressable style={styles.BasicBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.BasicBtnText}>추가</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  )
}

//스타일 가이드
const styles = StyleSheet.create({
  mainForm: {
    backgroundColor: '#ffff',
    flex: 1,
  },
  BottomBtnMainForm: {
    margin: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '90%',
  },

  infoText: {
    ...globalStyle.body2,
    ...globalStyle.textDartGery,
    textAlign: 'justify',
    letterSpacing: 2.3,
    lineHeight: 18,
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  viewPadding: {
    padding: 20,
  },
  BasicBtn: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#2AFF91',
  },
  BasicBtnText: {
    ...globalStyle.button,
    textAlign: 'center',
    marginTop: 15,
  },
  input: {
    ...globalStyle.body2,
    height: 56,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C2C7CC',
  },
})

const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  UserInfo: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 10,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 110,
    height: 60,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: '#2AFF91',
  },
  buttonClose: {
    borderColor: '#FF8989',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  cross: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 17,
    height: 17,
  },
  headerText: {
    textAlign: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  row: {
    flexDirection: 'row',
  },
  UserImg: {
    margin: 'auto',
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#11F37E',
    marginBottom: 12,
  },
  infoText: {
    ...globalStyle.textDartGery,
    textAlign: 'center',
    width: 170,
    marginTop: 15,
    marginBottom: 30,
  },
  btnText: {
    textAlign: 'center',
    marginTop: 5,
  },
})
