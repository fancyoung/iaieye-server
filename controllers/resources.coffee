mongoose = require 'mongoose'
Resource = mongoose.model 'Resource'

exports.list = (req, res) ->
  Resource.find({})
    .sort('-created')
    .exec (err, resources) ->
      if err
        res.render 'error',
          status: 500
      else
        res.json resources

exports.create = (req, res) ->
  resource = new Resource req.body
  resource.save (err) ->
    if err
      res.json err
    else
      res.json resource

exports.show = (req, res) ->
exports.update = (req, res) ->
exports.destory = (req, res) ->
