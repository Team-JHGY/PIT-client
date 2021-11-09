import React, { useEffect, useState, useContext } from 'react'
import * as SplashScreen from 'expo-splash-screen'

import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Image, AsyncStorage } from 'react-native'

//Pages
import MainView from './src/views/Main'
import LoginView from './src/views/Login'
import Members from './src/views/myMembers/Members'
import NewMembers from './src/views/myMembers/NewMember'
import MyPage from './src/views/myPage/MyPage'
import Schedule from './src/views/schedule/Schedule'
import ScheduleGuide from './src/views/schedule/ScheduleGuide'
import AddSchedule from './src/views/schedule/AddSchedule'
import ScheduleDetailInfo from './src/views/schedule/ScheduleDetailInfo'
import PTGoal from './src/views/ptGoal/PTGoal'
import AddMembersCode from './src/views/myMembers/AddMemberCode'
import SignUpView from './src/views/SignUp/SignUp'
import EditMyPage from './src/views/myPage/EidtMyPage'
import KakaoLogin from './src/views/login/KakaoLogin'
import NaverLogin from './src/views/login/NaverLogin'
import MyTrainers from './src/views/myPage/MyTrainers'
import MealPlan from './src/views/mealPlan/MealPlan'
import AddMealPlan from './src/views/mealPlan/AddMealPlan'
import MealCommentPage from './src/views/mealPlan/MealCommentPage'

//Bottom nav Images
import calendar_on from './assets/calendar_on.png'
import calendar_off from './assets/calendar_off.png'
import home_off from './assets/home_off.png'
import home_on from './assets/home_on.png'
import my_on from './assets/my_on.png'
import my_off from './assets/my_off.png'
import trainees_off from './assets/trainees_off.png'
import trainees_on from './assets/trainees_on.png'

//Context
import UserStore from './src/store/user'
import { UserContext } from './src/store/user'

// Bottom Nav 연결 부분
const Tab = createBottomTabNavigator()

//하단 라우팅 담당 + 네비게이션
export function BottomNav() {
  const { userState, userDispatch } = useContext(UserContext)

  const { role } = userState

  return (
    <Tab.Navigator
      style={styles.bottomNavMain}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === '운동/식단') {
            iconName = focused ? calendar_on : calendar_off
          } else if (route.name === '홈') {
            iconName = focused ? home_on : home_off
          } else if (route.name === '마이') {
            iconName = focused ? my_on : my_off
          } else if (route.name === '스케쥴') {
            iconName = focused ? calendar_on : calendar_off
          } else if (route.name === '회원') {
            iconName = focused ? trainees_on : trainees_off
          }
          //이미지 적용 완료
          return <Image style={styles.icons} source={iconName} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name={role === 'member' ? '홈' : '스케쥴'}
        component={role === 'member' ? MainView : Schedule}
      />
      <Tab.Screen
        name={role === 'member' ? '운동/식단' : '회원'}
        component={role === 'member' ? MealPlan : Members}
      />
      <Tab.Screen
        name={role === 'member' ? '마이' : '마이'}
        component={role === 'member' ? MyPage : MyPage}
      />
    </Tab.Navigator>
  )
}

export function memberRoomNav({ navigation, route }) {
  const { userState, userDispatch } = useContext(UserContext)

  const { role } = userState

  return (
    <Tab.Navigator
      style={styles.bottomNavMain}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === '운동/식단') {
            iconName = focused ? calendar_on : calendar_off
          } else if (route.name === '홈') {
            iconName = focused ? home_on : home_off
          }
          return <Image style={styles.icons} source={iconName} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name={'홈'} children={() => <MainView navigation={navigation} route={route} />} />
      <Tab.Screen name={'운동/식단'} component={MealPlan} />
    </Tab.Navigator>
  )
}
const Stack = createStackNavigator()
var initialView = ''

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [routeName, setRoutName] = useState()

  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('JWT').then((value) => {
        if (value != null) {
          // 테스트 환경 셋팅 더미 계정
          //initialView = 'Home'
          initialView = 'Login'
        } else {
          initialView = 'Login'
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync()
        // Make any API calls you need to do here
        await getJWT()

        await Font.loadAsync({
          // Load a font `NotoSansKR` from a static resource
          NotoSansKRBold: require('./assets/fonts/NotoSansKR-Bold.otf'),
          NotoSansKRMedium: require('./assets/fonts/NotoSansKR-Medium.otf'),
          NotoSansKRRegular: require('./assets/fonts/NotoSansKR-Regular.otf'),
        })
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  if (!appIsReady) {
    return null
  }

  return (
    <UserStore>
      <NavigationContainer>
        {/* 상단 Appbar는 따로 적용진행  상단 Appbar 없는 부분이 있기에 ..! */}
        <Stack.Navigator initialRouteName={initialView} screenOptions={{ header: () => null }}>
          <Stack.Screen name="Login" component={LoginView} />
          <Stack.Screen name="Main" component={MainView} />
          <Stack.Screen name="SignUp" component={SignUpView} />
          <Stack.Screen name="Members" component={Members} />
          <Stack.Screen name="NewMembers" component={NewMembers} />
          <Stack.Screen name="Home" component={BottomNav} />
          <Stack.Screen name="MemberRoom" component={memberRoomNav} />
          <Stack.Screen name="Schedule" component={Schedule} />
          <Stack.Screen name="ScheduleGuide" component={ScheduleGuide} />
          <Stack.Screen name="AddSchedule" component={AddSchedule} />
          <Stack.Screen name="ScheduleDetailInfo" component={ScheduleDetailInfo} />
          <Stack.Screen name="PTGoal" component={PTGoal} />
          <Stack.Screen name="MyPage" component={MyPage} />
          <Stack.Screen name="EditMyPage" component={EditMyPage} />
          <Stack.Screen name="AddMembersCode" component={AddMembersCode} />
          <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
          <Stack.Screen name="NaverLogin" component={NaverLogin} />
          <Stack.Screen name="MyTrainers" component={MyTrainers} />
          <Stack.Screen name="MealPlan" component={MealPlan} />
          <Stack.Screen name="AddMealPlan" component={AddMealPlan} />
          <Stack.Screen name="MealCommentPage" component={MealCommentPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserStore>
  )
}

const styles = StyleSheet.create({
  bottomNavMain: {
    flexDirection: 'row',
    alignContent: 'space-between',
    backgroundColor: '#ffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16.0,
    elevation: 24,
    height: 80,
    textAlign: 'left',
    borderBottomWidth: 0.2,
    borderBottomColor: '#5A5757',
    //justifyContent:"flex-start"
  },
  icons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 24,
    height: 24,
  },
})
