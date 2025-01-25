


global.fs = require('fs')
global.path = require('path')
global.mime = require('mime')



require('./System')



global.config = { dev: true, port: 8080 }

try {

	Object.assign(config, require.main.require('./config'))

} catch(e) {

	console.warn(`config undefined`)
}



require('./SQL')
require('./Web')



// module.exports = callback => callback()



// process.on('uncaughtException', exception => console.log(exception))
