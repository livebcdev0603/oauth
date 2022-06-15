// Imports
import mongoose, { Schema } from 'mongoose'

// Collection name
export const collection = 'User'

// Schema
const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // // TODO: create new password
    // password: {
    //   type: String,
    //   required: true,
    // },

    name: {
      type: String,
      required: true,
    },

    // add oauth tokens
    tokens: {
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
