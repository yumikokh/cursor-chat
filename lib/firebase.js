import firebase from 'firebase/app'
import 'firebase/database'

firebase.initializeApp({
  databaseURL: 'https://multi-website-5a672.firebaseio.com/'
})
const db = firebase.database()

// write
const writeCursorPos = (userId, name, x, y) => {
  db.ref(`users/${userId}`).set({
    name,
    x,
    y
  })
}

// read
const listenCursorPos = cb => {
  db.ref('users').on('value', snapshot => {
    cb(snapshot.val())
  })
}

// delete
const deleteCursor = userId => {
  db.ref(`users/${userId}`).remove()
}

export { writeCursorPos, listenCursorPos, deleteCursor }
