// App imports
import params from 'setup/config/params'
import { authCheck } from 'setup/helpers/utils'
import v from 'setup/helpers/validation'
import { AuthError, ValidationError } from 'modules/common/errors'
import Mail from 'modules/mail/model'

// Save
export default async function save({ params: { data }, auth }) {
  if (authCheck(auth)) {
    // Validation rules
    const rules = [
      {
        data: { value: data },
        check: 'isNotEmpty',
        message: 'Invalid data.',
      },
    ]

    // Validate
    try {
      v.validate(rules)
    } catch (error) {
      throw new ValidationError(error.message)
    }

    try {
      const fields = { userId: auth.user._id, data }

      // Mail
      const data = await Mail.create({
        ...fields,
        isDeleted: false,
      })

      return {
        data,
        message: `Mail has been saved successfully.`,
      }
    } catch (error) {
      throw new Error(`An error occurred. ${error.message}`)
    }
  }

  throw new AuthError('You are not authorized to perform this action.')
}
