// Imports
import axios from 'axios'

// Set user jwtToken and info in localStorage and axios auth headers
export default function loginSetUserLocalStorage(jwtToken, user) {
  if (jwtToken) {
    axios.defaults.headers.common['Authentication'] = `Bearer ${jwtToken}`
  } else {
    delete axios.defaults.headers.common['Authentication']
  }

  // Update jwtToken
  window.localStorage.setItem('jwtToken', jwtToken)
  window.localStorage.setItem('user', JSON.stringify(user))
}
