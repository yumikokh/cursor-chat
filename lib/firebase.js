import firebase from 'firebase/app'
import 'firebase/database'

firebase.initializeApp({
  databaseURL: 'https://multi-website-5a672.firebaseio.com/'
})
const db = firebase.database()

// write
export const writeCursorPos = (userId, name, x, y) => {
  db.ref(`users/${userId}`).set({
    name,
    x,
    y
  })
}

// read
export const listenCursorPos = cb => {
  db.ref('users').on('value', snapshot => {
    cb(snapshot.val())
  })
}

// delete
export const deleteCursor = userId => {
  db.ref(`users/${userId}`).remove()
}

// kayac logo
export const writeHover = (type, isHover) => {
  db.ref(`hover/${type}`).set({
    isHover
  })
}
// read
export const listenHover = cb => {
  db.ref('hover').on('value', snapshot => {
    cb(snapshot.val())
  })
}
