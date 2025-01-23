


server.template = {}



server.scan = folder => {



	let relative = path
	.relative(server.root, folder)
	.replace(/\\/g, '/')



	fs.existsSync(folder) &&
	fs.readdirSync(folder).forEach(dir => {

		let tmp = path.join(folder, dir)

		if (fs.lstatSync(tmp).isDirectory())
		return server.scan(tmp)

		if (tmp.endsWith('.tpl')) {

			let name = path.parse(tmp).name
			name = relative ? `${ relative }/${ name }` : name

			server.template[name] = {

				path: tmp,
				content: fs.readFileSync(tmp, {

					encoding: 'utf8', flag: 'r'
				})
			}
		}
	})
}



server.scan(server.root)



const NestedKey = (data, key) => {

	return key.split('.').reduce((a, part) =>
	a && part in a ? a[part] : '', data)
}



let regif = /\{\{\s*#if\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\s*\/if\s*\}\}/g
let regeach = /\{\{\s*#each\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\s*\/each\s*\}\}/g
let regdata = /\{\{\s*([\w.]+)\s*\}\}/g
let regtemplate = /\[\[\s*([\w\/]+)\s*\]\]/g



const fromFile = name => {

	let tmp = server.template[name] ?. path ||
	path.join(server.root, `${ name }.tpl`)

	if (fs.existsSync(tmp))
	return fs.readFileSync(tmp, { encoding: 'utf8', flag: 'r' })

	return name
}



server.render = (name, data, depth = 0) => {



	if (depth > 5) {

		console.err('template maximum callstack:', name)
		return ''
	}



	let content = config.dev ?
	fromFile(name) : server.template[name] ?. content || name



	// if

	content = content.replace(regif, (match, key, ctx) => {

		const value = NestedKey(data, key)
        return value ? ctx : ''
    })



	// each

	content = content.replace(regeach, (match, key, ctx) => {

		// console.log({ match, key, ctx })

		const array = NestedKey(data, key)

		if (Array.isArray(array)) {

			return array.map(item =>
			server.render(ctx, { ...data, this: item }, depth + 1)).join('')
		}

		return ''
    })



	// data

	content = content.replace(regdata, (match, key) => {

		// console.log({ data, match, key })

        return NestedKey(data, key)
    })



	// template

	content = content.replace(regtemplate, (match, name) => {

		// console.log({ match, name })

		if (server.template[name])
		return server.render(name, data, depth + 1)

		console.err('template undefined', name)
        return ''
    })



	return content.replace(/\n\s*\n/g, '\n')
}
