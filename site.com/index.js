


require('../handler')
require('./user')



Server.on('start', () => {

	// process.exit()
})



Server.get('/', (req, res) => {



	/*
		req.cookies.key
		res.cookie('key', 'value', { maxAge: 10000 });
		res.clearCookie('key')
	*/



	let data = {

		array: Array(20).fill(10),

		user: [

		    { name: "Dev", role: "Admin" },
		    { name: "Mod", role: "Moder" },
		],

		server: {

			hostname: server.domain,
			show: true
		}
	}

	let output = server.render('src/main', data)



	res.setHeader('Content-Type', 'text/html; charset=UTF-8')
	res.send(output)
})
