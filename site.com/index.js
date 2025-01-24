


require('../handler')
require('./user')



Server.on('start', () => {

	// process.exit()
})



/*
	Main
*/

Server.get('/throw', (req, res) => {

	throw new Error('Ran out of coffee')
})

Server.get('/', (req, res) => {

	// скелетная анимация css

	/*
		req.cookies.key
		res.cookie('key', 'value', { maxAge: 10000 });
		res.clearCookie('key')
	*/

	Err(res, {

		code: 200,
		status: 'OK',
		message: 'Тут пока пусто'
	})

	// let output = server.render('src/main')
	//
	// res.setHeader('Content-Type', 'text/html; charset=UTF-8')
	// res.send(output)
})



/*
	Router
*/



const Page = (req, res, next) => {

	return Err(res, {

		code: 404,
		status: 'page not found',
		message: 'Страница не найдена'
	})
}



Server.get('/*', (req, res) => {

	const resource = path.join(server.src, req.url)

	if (path.extname(resource)) {

		let type = mime.lookup(resource)

		return fs.access(resource, fs.constants.F_OK, err => {

			if (err || ! config.allow_mime.includes(type)) {

				return Err(res, {

					code: 404,
					status: 'file not found or mime type not allowed',
					message: 'Файл не найден или запрещён'
				})
			}

			res.setHeader('Content-Type', type)
			return res.sendFile(resource)
		})
	}

	Page(req, res)
})



server.set('env', 'production')
server.use(function(err, req, res, next) {

	console.err(err)
	console.log(err)

	Err(res, {

		code: 500,
		status: 'Internal Server Error',
		message: 'Что-то пошло не так'
	})
})



const Err = (res, option) => {

	res.statusMessage = option.status
	let output = server.render('src/error', { message: option.message })

	res.setHeader('Content-Type', 'text/html; charset=UTF-8')
	res.status(option.code).send(output)
}
