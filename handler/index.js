


global.fs = require('fs')
global.path = require('path')

global.http = require('http')
global.express = require('express')
global.app = express()



global.config = require.main.require('./config')



require('./System')
require('./SQL')



http.createServer(app).listen(config.port, () => {

	process.title = `${ path.basename(require.main.path) } ${ config.port }`

	console.ok(process.title)
})



// module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
