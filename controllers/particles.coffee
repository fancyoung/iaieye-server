mongoose = require 'mongoose'
Particle = mongoose.model 'Particle'
Resource = mongoose.model 'Resource'

exports.list = (req, res) ->
  Particle.find({})
    .sort('-created')
    .populate('creator', 'username')
    .populate('resource', 'url title')
    .exec (err, particles) ->
      if err
        res.render 'error',
          status: 500
      else
        res.json particles

exports.create = (req, res) ->
  content = req.body.content
  resourceId = req.body.resourceId
  Resource.findById(resourceId)
    .exec (err, resource) ->
      if resource
        particle = new Particle
          resource: resource
          content: content
          creator: req.user
        particle.save (err) ->
          if err
            res.json
              err: err
          else
            res.json particle
      else
        res.json
          err: 'resource not exist'
  particle = new Particle
