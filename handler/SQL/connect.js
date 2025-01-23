


const MySQL = require('mysql')



const mysql = {

	connect() {



		if (! config.DataBase) return

		this.connection = MySQL.createConnection(config.DataBase)



		this.connection.connect(err => {

			if (err) {

				if (this.err != err.code)
				console.err('DataBase', this.err = err.code)

				return setTimeout(() => this.connect(), 5000)
			}

			this.err = false
			console.ok('DataBase connect success')
		})



		this.connection.on('error', err => this.connect())
	}
}

mysql.connect()










$(DB).get(function online() {

	return mysql.connection ?. state == 'authenticated'
})










$(DB).get(async function connection() {

	return await new Promise(resolve => {

		let interval = () => {

			if (mysql.connection.state == 'authenticated')
			return resolve(mysql.connection)

			setTimeout(interval, 250)
		}

		interval()
	})
})
