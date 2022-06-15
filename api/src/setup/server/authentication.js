// Imports
import jwt from 'jsonwebtoken'
import axios from 'axios'

// App Imports
import { SECURITY_SECRET } from 'setup/config/env'
import User from 'modules/user/model'
import { oauth2Client } from 'setup/helpers/googleapi'

// Authentication middleware
export default async function (request, response, next) {
  const header = request.headers.authentication

  if (header) {
    try {
      const jwtToken = header.split(' ')
      const userToken = jwt.verify(jwtToken[1], SECURITY_SECRET)
      let user = await User.findOne({ _id: userToken.id })
      await oauth2Client.setCredentials({
        refresh_token: user.refresh_token,
      })
      await oauth2Client.on('tokens', async (tokens) => {
        console.log(
          '🚀 ~ file: googleapi.js ~ line 80 ~ oauth2Client.on ~ tokens.refresh_token',
          tokens.refresh_token,
        )
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
          user = await User.findByIdAndUpdate(user._id, {
            refresh_token: tokens.refresh_token,
          })
        }
      })
      request.auth = {
        isAuthenticated: true,
        user,
      }
    } catch (e) {
      console.warn('Invalid jwt tokens detected.')
    }
  } else {
    request.auth = {
      isAuthenticated: false,
      user: null,
    }
  }

  next()
}
