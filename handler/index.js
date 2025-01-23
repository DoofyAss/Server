


global.fs = require('fs')
global.path = require('path')



module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
