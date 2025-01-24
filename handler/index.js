


global.fs = require('fs')
global.path = require('path')
global.mime = require('mime')

global.config = require.main.require('./config')



require('./Web')
require('./System')
require('./SQL')



// module.exports = callback => callback()



// process.on('uncaughtException', exception => console.log(exception))
