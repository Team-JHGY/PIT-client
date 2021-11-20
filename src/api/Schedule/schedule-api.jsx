export let getNextLessonInfo = async (props) => {
  let url
  if (userState.role === 'member') {
    url = `${config.BASE_URL}/schedules/next/member/${userInfo.sub}`
  } else if (userState.role === 'trainer') {
    url = `${config.BASE_URL}/schedules/next/member/${routeMsg.memberInfo.member.id}`
  }
  await fetch(url, {
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
        //   let startAtDate = new Date(res.data.startAt)
        //   let endAtDate = new Date(res.data.endAt)

        //   setNextLessonInfo(
        //     `${getMonthOfDate(startAtDate)}/${getDayOfDate(startAtDate)}(${getDayOfWeek(
        //       startAtDate
        //     )}) ${getTimeOfDate(startAtDate)} ~ ${getTimeOfDate(endAtDate)}`
        //   )
        //   setNextLessonSequence(res.data.sequence)

        return res.data
      } else if (res.code === -13) {
        //setNextLessonInfo('다음 수업 정보가 없습니다.')
        return res.code.data
      } else {
        console.log(res)
      }
    })
    .catch((e) => console.log(e))
}
