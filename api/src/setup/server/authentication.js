// Imports
import jwt from 'jsonwebtoken'

// App Imports
import { SECURITY_SECRET } from 'setup/config/env'
import User from 'modules/user/model'
import { setCredentials, refreshToken } from 'setup/helpers/googleapi'

// Authentication middleware
export default async function (request, response, next) {
  const header = request.headers.authentication

  if (header) {
    try {
      const jwtToken = header.split(' ')
      const userToken = jwt.verify(jwtToken[1], SECURITY_SECRET)
      let user = await User.findOne({ _id: userToken.id })

      const newTokens = await refreshToken(user.tokens)
      console.log(
        '🚀 ~ file: googleapi.js ~ line 80 ~ oauth2Client.on ~ newTokens',
        newTokens,
      )
      if (newTokens) {
        // store the refresh_token in my database!
        user = await User.findByIdAndUpdate(user._id, {
          tokens: {
            refresh_token: user.tokens.refresh_token,
            access_token: newTokens.access_token,
          },
        })
      }

      request.auth = {
        isAuthenticated: true,
        user,
      }
    } catch (err) {
      console.warn('Invalid jwt tokens detected.', err)
    }
  } else {
    request.auth = {
      isAuthenticated: false,
      user: null,
    }
  }

  next()
}
