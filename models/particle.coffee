mongoose = require 'mongoose'
Schema = mongoose.Schema

ParticleSchema = new Schema
  created:
    type: Date
    default: Date.now
  resource:
    type: Schema.ObjectId
    ref: 'Resource'
  content:
    type: String
    default: ''
  creator:
    type: Schema.ObjectId
    ref: 'User'

ParticleSchema.methods.toJSON = ->
  obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  obj

mongoose.model 'Particle', ParticleSchema
