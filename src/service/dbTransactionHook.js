const Transaction = require('../models/dbTransaction')

function onRequest(req, res, next) {
	const transaction = new Transaction({
		request: {
			id: req.id,
			url: req.url,
			method: req.method,
			authorisation: req.headers.authorization,
			userAgent: req.headers['user-agent'],
			params: req.params,
			querystring: req.query,
		},
	})
	req.transaction = transaction
	next()
}

function preHandler(req, res, next) {
	if (req.transaction) {
		req.transaction.dbOperation = getOp(req)
		req.transaction.authUserId = req.authUser ? req.authUser._id : undefined
		req.transaction.request.body = req.body
	}
	next()
}

function onError(req, res, error, next) {
	if (req.transaction) req.transaction.response.errorMessage = error.message
	next()
}

function onResponse(req, res, next) {
	if (req.transaction) {
		req.transaction.response.statusCode = res.statusCode
		req.transaction.save()
	}
	next()
}

function getOp(req) {
	if (!req.context.schema) return undefined
	if (req.context.schema.dbOperation) return req.context.schema.dbOperation
	if (req.method === 'POST') return 'insert'
	if (req.method === 'DELETE') return 'delete'
	if (['PATCH', 'PUT'].includes(req.method)) return 'update'
	return 'noop'
}

module.exports = {
	onRequest,
	preHandler,
	onResponse,
	onError,
}
