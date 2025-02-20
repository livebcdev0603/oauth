// App Imports
import { SET_USER } from 'modules/user/api/actions/types'

// Emit set user event
export default function loginSetUser(jwtToken, user) {
  return { type: SET_USER, user }
}
