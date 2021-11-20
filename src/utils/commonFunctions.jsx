const getDayOfWeek = (date) => {
  var week = new Array('일', '월', '화', '수', '목', '금', '토')
  var dt = new Date(date)

  var index = dt.getDay()
  return week[index]
}

const getMonthOfDate = (date) => {
  var month = date.getMonth() + 1
  if (month < 10) {
    return '0' + month
  } else {
    return month + ''
  }
}

const getDayOfDate = (date) => {
  var day = date.getDate()
  if (day < 10) {
    return '0' + day
  } else {
    return day + ''
  }
}

const getTimeOfDate = (date) => {
  console.log(date)
  const dateForm = JSON.stringify(date).split("T")[1].split(":")

  console.log(dateForm)

  let hour = Number(dateForm[0])
  let min = Number(dateForm[1])
  var strMin = ''
  if (min < 10) strMin = '0' + min
  else strMin = min
  
  
  if (hour >= 0 && hour < 12) return '오전 ' + hour + ':' + strMin
  else return '오후 ' + (hour - 12) + ':' + strMin
  
}
export { getDayOfWeek, getMonthOfDate, getDayOfDate, getTimeOfDate }
