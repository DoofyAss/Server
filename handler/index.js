


global.fs = require('fs')
global.path = require('path')



global.config = require.main.require('./config')



require('./System')
require('./SQL')



module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
