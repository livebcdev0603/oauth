// App imports
import axios from 'axios'
import { authCheck } from 'setup/helpers/utils'
import { AuthError } from 'modules/common/errors'
import Mail from 'modules/mail/model'
import User from 'modules/user/model'

// List
export default async function list({ auth }) {
  if (authCheck(auth)) {
    try {
      // Mail
      // let data;
      // const data = await Mail.find({
      //   userId: auth.user._id,
      //   isDeleted: false,
      // }).sort({ createdAt: -1 })

      const listData = await axios({
        url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
        params: {
          maxResults: 10,
          q: 'from:max628tes@gmail.com',
          includeSpamTrash: true,
        },
        method: 'get',
        headers: {
          Authorization: `Bearer ${auth.user.token.access_token}`,
          // Accept: 'application/json',
        },
      })
      const gmailList = listData.data.messages
      const res = await axios({
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${gmailList[0].id}`,
        params: {
          format: 'full',
        },
        method: 'get',
        headers: {
          Authorization: `Bearer ${auth.user.token.access_token}`,
          Accept: 'application/json',
        },
      })
      console.log('no error')
      if (res.data.payload.parts[1].body.data) {
        var body = res.data.payload.parts[1].body.data

        var htmlBody = base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'))
        console.log(htmlBody)
      //   var mailparser = new Mailparser()

      //   mailparser.on('end', (_err, res) => {
      //     console.log('res', res)
      //   })

      //   mailparser.on('data', (dat) => {
      //     if (dat.type === 'text') {
      //       const $ = cheerio.load(dat.textAsHtml)
      //       var links = []
      //       var modLinks = []
      //       $('a').each(function (i) {
      //         links[i] = $(this).attr('href')
      //       })

      //       // Regular Expression to filter out an array of urls.
      //       var pat = /------[0-9]-[0-9][0-9]/

      //       // A new array modLinks is created which stores the urls.
      //       modLinks = links.filter((li) => {
      //         if (li.match(pat) !== null) {
      //           return true
      //         } else {
      //           return false
      //         }
      //       })
      //       console.log(modLinks)

      //       // This function is called to open all links in the array.
      //     }
      //   })
      }

      // mailparser.write(htmlBody)
      // mailparser.end()

      // if (res.data.nextPageToken && pageToken !== res.data.nextPageToken)
      //   return resolve(
      //     fetchSpamMessages(auth, messageIds, res.data.nextPageToken)
      //   );
      // console.log("🚀 ~ file: google.js ~ line 43 ~ google ~ gmail", gmail)

      return {
        data: htmlBody,
      }
    } catch (error) {
      throw new Error(`An error occurred. ${error.message}`)
    }
  }

  throw new AuthError('You are not authorized to perform this action.')
}
