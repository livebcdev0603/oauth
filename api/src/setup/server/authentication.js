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

      // if (oauth2Client) {
      await setCredentials(user.tokens)
      await refreshToken().then(async (tokens) => {
        console.log(
          '🚀 ~ file: googleapi.js ~ line 80 ~ oauth2Client.on ~ tokens',
          tokens,
        )
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
          user = await User.findByIdAndUpdate(user._id, {
            tokens,
          })
        }
      })
      // oauth2Client.on('tokens', async (tokens) => {
      //   console.log(
      //     '🚀 ~ file: googleapi.js ~ line 80 ~ oauth2Client.on ~ tokens',
      //     tokens,
      //   )
      //   if (tokens.refresh_token) {
      //     // store the refresh_token in my database!
      //     user = await User.findByIdAndUpdate(user._id, {
      //       tokens,
      //     })
      //   }
      // })
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
