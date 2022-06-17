// Imports
import mongoose, { Schema } from 'mongoose'

// App imports
import { collection as User } from 'modules/user/model'

// Collection name
export const collection = 'Mails'

// Schema
const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },

    data: {
      type: Object,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
)

// Model
export default mongoose.model(collection, schema, collection)
