// Imports
import jwt from 'jsonwebtoken'
import axios from 'axios'

// App Imports
import { SECURITY_SECRET } from 'setup/config/env'
import User from 'modules/user/model'

// Authentication middleware
export default async function (request, response, next) {
  let access
  let header = request.headers.authentication

  if (header) {
    try {
      const jwtToken = header.split(' ')
      const userToken = jwt.verify(jwtToken[1], SECURITY_SECRET)
      let user = await User.findOne({ _id: userToken.id })

      if (user.tokens.expiry_date <= new Date().getTime()) {
        access = await axios({
          url: `https://oauth2.googleapis.com/token`,
          method: 'post',
          data: {
            client_id: OAUTH_GOOGLE_ID,
            client_secret: OAUTH_GOOGLE_SECRET,
            grant_type: 'refresh_token',
            refresh_token: user.tokens.refresh_token,
          },
        })

        request.auth = {
          isAuthenticated: true,
          user: {
            ...user,
            tokens: {
              ...user.tokens,
              access_token: access.data.access_token,
            },
          },
        }
      } else {
        request.auth = {
          isAuthenticated: true,
          user,
        }
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
