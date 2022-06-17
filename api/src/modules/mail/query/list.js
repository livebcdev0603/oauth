// App imports
import axios from 'axios'
import base64 from 'js-base64'
import { MailParser } from 'mailparser'
import cheerio from 'cheerio'

// google
import { authCheck } from 'setup/helpers/utils'
import { AuthError } from 'modules/common/errors'
import Mail from 'modules/mail/model'
import User from 'modules/user/model'
// const MailParser = require('mailparser').MailParser

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
          // q: 'from:max628tes@gmail.com zara',
          q: 'from:sgirad86@gmail.com zara',
          includeSpamTrash: true,
        },
        method: 'get',
        headers: {
          Authorization: `Bearer ${auth.user.tokens.access_token}`,
          // Accept: 'application/json',
        },
      })
      const gmailList = listData.data.messages
      console.log('-----------------------', gmailList)
      const res = await axios({
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${gmailList[0].id}`,
        params: {
          format: 'full',
        },
        method: 'get',
        headers: {
          Authorization: `Bearer ${auth.user.tokens.access_token}`,
          Accept: 'application/json',
        },
      })
      console.log('no error')
      if (res.data.payload.parts[1].body.data) {
        var body = res.data.payload.parts[1].body.data
        // var body0 = res.data.payload.parts[0].body.data
        // var htmlBody = base64.decode(
        //   body.replace(/-/g, '+').replace(/_/g, '/'),
        // )
        // console.log(htmlBody0)

        var htmlBody = base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'))
        const $ = cheerio.load(htmlBody);
        const productPrice = $('div[style="direction:ltr;text-transform:uppercase;font-family:Arial;text-align:center;color:#000000;font-size:18px;line-height:17px;margin-top:10px"]')
        const productSize = $('div[style="direction:ltr;text-transform:uppercase;font-family:Arial;text-align:center;color:#000000;font-size:20px;font-weight:bold;line-height:22px;margin-bottom:8px"]')
        const productColor = $('div[style="direction:ltr;font-family:Arial;font-size:14px;line-height:20px;text-align:center;color:#7f7f7f"]')
        const productNames = $('div[style="direction:ltr;font-family:Arial;font-size:14px;line-height:20px;text-align:center;text-transform:uppercase;color:#000000"]')
        const productImg = $('img[style="direction: ltr; object-fit: contain; border: 0px; display: block; outline: none; text-decoration: none; height: auto; width: 100%; visibility: visible;"]')
        const purchasedDate = $('div[style="direction:ltr;font-weight:bold;text-transform:uppercase;font-family:Arial;text-align:center;color:#000000;line-height:23px;font-size:18px"]')
        let products = [];
        let product;
        let j=0;

        for(let i=0; i<productImg.length; i++) {
          while((productNames[j].children[0].data == ' ')){
            j++;
          }
          const name = productNames[j].children[0].data.trim();
          const size = productSize[i].children[0].data.trim()
          const color = productColor[i].children[0].data.trim()
          const price = productPrice[i].children[0].data.trim()
          const img = productImg[i].attribs.src.trim();
          j++;
          // console.log('-----------', name, size, color, price, img)
          product = {name, size, color, price, img}
          // console.log('------', product)
          products.push(product)
        }
        console.log('products', products)
        
      }

      // mailparser.write(products)
      // mailparser.end()

      // if (res.data.nextPageToken && pageToken !== res.data.nextPageToken)
      //   return resolve(
      //     fetchSpamMessages(auth, messageIds, res.data.nextPageToken)
      //   );
      // console.log("🚀 ~ file: google.js ~ line 43 ~ google ~ gmail", gmail)
      return {
        data: products,
      }
    } catch (error) {
      throw new Error(`An error occurred. ${error.message}`)
    }
  }

  throw new AuthError('You are not authorized to perform this action.')
}
