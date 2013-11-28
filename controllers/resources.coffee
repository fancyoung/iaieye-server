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
  resource = new Resource req.body
  resource.save (err) ->
    if err
      res.json err
    else
      res.json resource

exports.show = (req, res) ->
exports.update = (req, res) ->
exports.destory = (req, res) ->

exports.fetchByUrl = (req, res, next) ->
  url = req.body.url
  title = ''
  async.waterfall [
    (next) ->
      # request url, (err, response, html) ->
      #   if !err and response.statusCode == 200
      #     next null, iconv.decode(html, 'gb2312')
      #   else
      #     console.log err || response.statusCode
      try
        http.get url, (res) ->
          bufferHelper = new BufferHelper()
          res.on 'data', (chunk) ->
            bufferHelper.concat chunk
          res.on 'end', ->
            buf = bufferHelper.toBuffer()
            charset = /<meta[^>]+(gb2312|gbk)[^>]+>/im.exec(iconv.decode(buf, 'utf8'))
            next null, iconv.decode(buf, charset && charset[1] || 'utf8')
        .on 'error', (error) ->
          next error
      catch error
        next error
    (html, next) ->
      $ = cheerio.load html
      title = $('title').text().trim()
      # 仿佛必须用BufferHelper处理乱码，解析后无法解决
      # charset = ''
      # getCharset = (str) ->
      #   c = str.match /gb2312|gbk/i
      #   c && c[0].toLowerCase()
      # if $('meta[charset]').length > 0
      #   charset = getCharset $('meta[charset]').attr('charset')
      # else if $('meta[http-equiv][content]').length > 0
      #   charset = getCharset $('meta[http-equiv][content]').attr('content')
      # if charset
      #   console.log charset
      # title = iconv.decode(title, charset)

      next null,
        url: url
        title: title
    (data, next) ->
      console.log data
      res.json data
  ],
    (err, result) ->
      res.json
        err: err.toString() # if not use `toString`, will return json `err: {}` when protocol error, why?
