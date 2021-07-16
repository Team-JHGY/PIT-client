import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  heading1: {
    fontFamily: 'NotoSansKRBold',
    fontSize: 22,
    lineHeight: 34,
    color: '#0F1528',
  },
  heading2: {
    fontFamily: 'NotoSansKRBold',
    fontSize: 16,
  },
  header: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 20,
  },
  body1: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 16,
  },
  body2: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 14,
  },
  body2Bold: {
    fontFamily: 'NotoSansKRBold',
    fontSize: 14
  },

  button: {
    fontFamily: 'NotoSansKRBold',
    fontSize: 18,
  },
  col_1:{
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
  },
  col_2:{
    flexGrow: 2,
    flexShrink: 2,
    flexBasis: "auto",
  },
  row:{
    flexDirection:"row"
  },
  textField: {
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    padding:5
  },

  textDarkRed: {
    color: '#DD0101',
  },
  textDartGery: {
    color: '#5A5757',
  },
  textWhite:{
    color:"#ffffff"
  },
  textBlack:{
    color:"#000000"
  },
  textDartGery:{
    color:"#5A5757"
  },
  textDimmedGrey:{
    color:"#A6ACB2"
  },
  textDarkGreen:{
    color:"#00D98B"
  },
  buttonGrey:{
    borderColor:"#C2C7CC"
  },
  buttonLightGreen:{
    backgroundColor:"#2AFF91"
  },
  buttonLightRed:{
    borderColor:"#FF8989"
  },
  inputGrey:{
    borderColor:"#C2C7CC"
  },
  inputLightGrey:{
    borderColor:"#E1EAF9"
  },
  appbarMain: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
    textAlign: 'left',
    borderBottomWidth: 0.2,
    borderBottomColor: '#C2C7CC',
    justifyContent: 'flex-start',
  },
  titleAppbar: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
  },
  appbarBtn: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    padding:10,
    height: 36,
    borderWidth: 1,
    borderColor: '#eee',
  },
  appbarBtnArrow: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    margin: 2,
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#eee',
  },
  arrowImg: {
    height: 20,
    width: 20,
    margin: 6,
  },
  title: {
    height: 34,
    width: 17,
    marginLeft: 10,
  },
  appbarBtnText: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 14,
    color: '#5A5757',
    textAlign: 'center',
    justifyContent:"center"
  },
  appbarMain: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
    textAlign: 'left',
    borderBottomWidth: 0.2,
    borderBottomColor: '#C2C7CC',
    justifyContent: 'flex-start',
  },
  appbarMainNotBorder: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  titleAppbar: {
    backgroundColor: '#ffff',
    elevation: 0,
    height: 90,
  },
  appbarBtn: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    margin: 2,
    width: 88,
    height: 36,
    borderWidth: 1,
    borderColor: '#eee',
  },
  appbarBtnArrow: {
    backgroundColor: '#ffff',
    borderRadius: 5,
    margin: 2,
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#eee',
  },
  arrowImg: {
    height: 20,
    width: 20,
    margin: 6,
  },
  title: {
    height: 17,
    width: 17,
    margin: 10,
  },
  appbarBtnText: {
    fontFamily: 'NotoSansKRMedium',
    fontSize: 14,
    color: '#5A5757',
    textAlign: 'center',
    marginTop: 5,
  },
  BottomBtnMainForm: {
    margin: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '90%',
  },
  BasicBtn: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#2AFF91',
  },
  BasicBtnDisable: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#2AFF91',
    opacity:0.4
  },
  BasicBtnText: {
    fontFamily: 'NotoSansKRBold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
})
