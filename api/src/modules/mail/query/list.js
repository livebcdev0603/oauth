// App imports
import { authCheck } from 'setup/helpers/utils'
import { AuthError } from 'modules/common/errors'
import Mail from 'modules/mail/model'
import User from 'modules/user/model'

// List
export default async function list({ auth }) {
  if (authCheck(auth)) {
    try {
      // Mail
      const data = await Mail.find({
        userId: auth.user._id,
        isDeleted: false,
      }).sort({ createdAt: -1 })

      const gmail = await axios({
        url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
        method: 'get',
        headers: {
          Authorization: `Bearer ${access.data.access_token}`,
          // Accept: 'application/json',
        },
      })
      console.log("🚀 ~ file: google.js ~ line 43 ~ google ~ gmail", gmail)

      return {
        data,
      }
    } catch (error) {
      throw new Error(`An error occurred. ${error.message}`)
    }
  }

  throw new AuthError('You are not authorized to perform this action.')
}
