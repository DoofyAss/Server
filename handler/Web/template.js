


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










const reg_if = /\{\{\s*#if\s+(.*?)\s*\}\}|\{\{\s*\/if\s*\}\}|\{\{\s*\/else\s*\}\}/g

const reg_each_s = /\{\{\s*#each\s+([\w.]+)\s*\}\}/g
const reg_each_e = /\{\{\s*\/each\s*\}\}/g

const reg_data = /\{\{\s*([\w.]+)\s*\}\}/g

const reg_template = /\[\[\s*([\w\/]+)\s*\]\]/g










const fromFile = name => {

	let tmp = server.template[name] ?. path ||
	path.join(server.root, `${ name }.tpl`)

	if (fs.existsSync(tmp))
	return fs.readFileSync(tmp, { encoding: 'utf8', flag: 'r' })

	return name
}










const EvaluateCondition = (data, condition) => {

    try {

        return new Function('data', 'with(data) { return !!(' + condition + '); }')(data)

    } catch {

        return false
    }
}










const RenderIf = (ctx, data) => {

    const tokens = []
    const stack = []
    let lastIndex = 0

    ctx.replace(reg_if, (match, condition, offset) => {

        if (offset > lastIndex)
		tokens.push(ctx.slice(lastIndex, offset))

        if (match.startsWith('{{ #if')) {

            stack.push({

                type: 'if',
                condition: condition,
                start: tokens.length,
                trueContent: [],
                falseContent: []
            })

            tokens.push(null)

        } else if (match === '{{ /if }}') {

            const block = stack.pop()
            if (! block) throw new Error('Unbalanced if/endif')

            const content = tokens.slice(block.start + 1)

            const elseIndex = content.findIndex(item =>
            typeof item === 'object' && item.type === 'else')

            if (elseIndex !== -1) {

                block.trueContent = content.slice(0, elseIndex)
                block.falseContent = content.slice(elseIndex + 1)

            } else {

                block.trueContent = content
            }

            tokens[block.start] = block
            tokens.length = block.start + 1

        } else if (match === '{{ /else }}') {

            if (! stack.length || stack[stack.length - 1].type !== 'if')
			throw new Error('Unexpected else')

            tokens.push({ type: 'else' })
        }

        lastIndex = offset + match.length
        return match
    })

    if (lastIndex < ctx.length)
	tokens.push(ctx.slice(lastIndex))

    const renderNode = (node) => {

        if (typeof node === 'string') return node

        if (node.type === 'if') {

            const conditionMet = EvaluateCondition(data, node.condition)
            const renderedTrue = renderContent(node.trueContent)
            const renderedFalse = renderContent(node.falseContent)
            return conditionMet ? renderedTrue : renderedFalse
        }

        return ''
    }

    const renderContent = (content) => {

        return content.map(item =>
        typeof item === 'string' ? item : renderNode(item)).join('')
    }

    return renderContent(tokens)
}










const NestedKey = (data, key) => {

	return key.split('.').reduce((acc, part) => {

		if (acc && part in acc) {

            return acc[part]
        }

        return undefined

    }, data)
}










const RenderEach = (ctx, data) => {

	reg_each_s.lastIndex = 0
	reg_each_e.lastIndex = 0



	let match = reg_each_s.exec(ctx)
	let from = match ?. index

	if (! from) return ctx

	let key = match[1]
	let len = match[0].length

	let array = NestedKey(data, key)
	if (! Array.isArray(array)) return ctx



	let to, end
	while((match = reg_each_e.exec(ctx)) != null)
	to = match.index, end = match[0].length

	let content = ctx.slice(from + len, to)

	let result = array.map(item =>
	server.render(content, { ...data, this: item })).join('')

	return ctx.slice(0, from) + result + ctx.slice(to + end)
}










server.render = (name, data, depth = 0) => {



	if (depth > 5) {

		console.err('template maximum callstack:', name)
		return ''
	}



	let ctx = config.dev ?
	fromFile(name) : server.template[name] ?. content || name



	// IF

	ctx = RenderIf(ctx, data)



	// Each

	ctx = RenderEach(ctx, data)



	// Data

	ctx = ctx.replace(reg_data, (match, key) => {

        return NestedKey(data, key) || ''
    })



	// Template

	ctx = ctx.replace(reg_template, (match, name) => {

		if (server.template[name])
		return server.render(name, data, depth + 1)

		console.err('template undefined', name)
        return ''
    })



	return ctx

	// return ctx.replace(/>\s+</g, "><")
	// return ctx.replace(/\n\s*\n/g, '\n')
	// return ctx.replace(/\s*\n\s*/g, '\n').replace(/>\s+</g, "><")
}
