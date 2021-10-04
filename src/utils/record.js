const dateKey = 'recordDate'

export function getRecordDate () {
  return JSON.parse(localStorage.getItem(dateKey))
}
export function setRecordDate (date) {
  return localStorage.setItem(dateKey, JSON.stringify(date))
}
export function removeRecordDate () {
  return localStorage.removeItem(dateKey)
}
