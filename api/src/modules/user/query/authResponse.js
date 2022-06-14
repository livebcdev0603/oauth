// Imports
import jwt from 'jsonwebtoken'

// App Imports
import { SECURITY_SECRET } from 'setup/config/env'

// Auth Response (jwt token and user info)
export default function userAuthResponse(user) {
  user = user.toJSON()

  // delete user oauthToken
  delete user.token
  delete user.password

  return {
    jwtToken: jwt.sign({ id: user._id }, SECURITY_SECRET),
    user,
  }
}
