// Imports
import jwt from 'jsonwebtoken'

// App Imports
import { SECURITY_SECRET } from 'setup/config/env'
import User from 'modules/user/model'

// Authentication middleware
export default async function (request, response, next) {
  let header = request.headers.authentication

  if (header) {
    try {
      const jwtToken = header.split(' ')
      const userToken = jwt.verify(jwtToken[1], SECURITY_SECRET)
      console.log("🚀 ~ file: authentication.js ~ line 16 ~ userToken", userToken)
      let user = await User.findOne({ _id: userToken.id })

      if (user) {
        request.auth = {
          isAuthenticated: true,
          user,
        }
      }
    } catch (e) {
      console.warn('Invalid jwt token detected.')
    }
  } else {
    request.auth = {
      isAuthenticated: false,
      user: null,
    }
  }

  next()
}
