


module.exports =
DB.user = {

	space: `site.user`,



	async init() {

		await DB(this.space).init({

			id: DB.increment,
			name: DB.varchar.null,
			mail: DB.varchar.null,
			create: DB.integer.unsigned.null
		})
	},



	async fetch(id) {

		return await DB(this.space, id).fetch(1)
	},



	async insert(data) {

		return await DB(this.space).insert(data)
	},



	async update(id, data) {

		return await DB(this.space, id).update(data)
	}
}
