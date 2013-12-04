mongoose = require 'mongoose'
Resource = mongoose.model 'Resource'
http = require 'http'
url = require 'url'
cheerio = require 'cheerio'
async = require 'async'
iconv = require 'iconv-lite'
BufferHelper = require 'bufferhelper'

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
  url = req.body.url
  title = req.body.title
  resource = new Resource
    url: url
    title: title
  resource.save (err) ->
    if err
      res.json err
    else
      res.json resource

exports.show = (req, res) ->
  Resource.findById(req.params.resourceId)
    .exec (err, resource) ->
      res.json resource    

exports.update = (req, res) ->
exports.destory = (req, res) ->

exports.fetchByUrl = (req, res, next) ->
  url = req.body.url
  title = ''
  async.waterfall [
    (next) ->
      Resource.findOne
        url: url
      .exec (err, resource) ->
        if resource
          res.json resource
        else
          next()
    (next) ->
      try
        http.get url, (res) ->
          bufferHelper = new BufferHelper()
          res.on 'data', (chunk) ->
            bufferHelper.concat chunk
          res.on 'end', ->
            buf = bufferHelper.toBuffer()
            charset = /<meta[^>]+(http-equiv|charset)[^>]+(gb2312|gbk)[^>]+>/im.exec(iconv.decode(buf, 'utf8'))
            next null, iconv.decode(buf, charset && charset[1] || 'utf8')
        .on 'error', (error) ->
          next error
      catch error
        next error
    (html, next) ->
      $ = cheerio.load html
      title = $('title').text().trim()
      next null,
        url: url
        title: title
    (data, next) ->
      res.json data
  ],
    (err, result) ->
      res.json
        err: err.toString() # if not use `toString`, will return json `err: {}` when protocol error, why?
