


global.http = require('http')
global.express = require('express')

global.Server =
global.server =
global.srv = express()

const cookieParser = require('cookie-parser')
server.use(cookieParser())



server.root = require.main.path
server.domain = path.basename(server.root)

server.src = path.join(server.root, 'src')
server.source = dir => path.join(server.src, dir)



express.response.source = dir => {

	//
}



require('./template')



http.createServer(server).listen(config.port, () => {

	process.title = `${ server.domain } ${ config.port }`

	console.ok(process.title)

	server.emit('start')
})
