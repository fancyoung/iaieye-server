mongoose = require 'mongoose'
Schema = mongoose.Schema

ResourceSchema = new Schema
  created:
    type: Date
    default: Date.now
  url:
    type: String
    index: true
    unique: true
    default: ''
    trim: true
  title:
    type: String
    default: ''

# ResourceSchema.virtual('id')
#   .get ->
#     this._id.toHexString()

ResourceSchema.methods.toJSON = ->
  obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  obj

mongoose.model 'Resource', ResourceSchema
