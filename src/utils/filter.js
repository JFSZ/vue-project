let dateFormat =  (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
  const hour = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}
export {
  dateFormat
}
