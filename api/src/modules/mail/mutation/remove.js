// App imports
import { authCheck } from 'setup/helpers/utils'
import v from 'setup/helpers/validation'
import { AuthError, ValidationError } from 'modules/common/errors'
import Mail from 'modules/mail/model'

// Remove
export default async function remove({ params: { mailId }, auth }) {
  if (authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: mailId },
        check: 'isNotempty',
        message: 'Invalid mail.',
      },
    ]

    // Validate
    try {
      v.validate(rules)
    } catch (error) {
      throw new ValidationError(error.message)
    }

    try {
      // Mail
      const data = await Mail.updateOne(
        { _id: mailId },
        { $set: { isDeleted: true } },
      )

      return {
        data,
        message: `Mail has been removed successfully.`,
      }
    } catch (error) {
      throw new Error(`An error occurred. ${error.message}`)
    }
  }

  throw new AuthError('You are not authorized to perform this action.')
}
