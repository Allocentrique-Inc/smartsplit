const Transaction = require('../models/transaction')
const zumrails = require('../service/zumrails')
const JWTAuth = require('../service/JWTAuth')

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/stocks',
		schema: {
			description: 'Get stocks',
			querystring: {
				type: 'object',
				properties: {
					userId: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: {
					type: 'array',
					items: { type: 'object', additionalProperties: true },
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: async function getStocks(req, res) {
			if (
				req.query.userId &&
				!req.authUser.isAdmin &&
				req.authUser !== req.query.userId
			)
				throw Errors.UserForbidden
			const filter = req.query.userId ? { ownerId: req.query.userId } : {}
			return await Stock.find(filter)
		},
	})

	fastify.route({
		method: 'POST',
		url: '/stocks/',
		schema: {
			description: 'Create a new stock',
			body: {
				type: 'object',
				required: ['name', 'type', 'totalPrice', 'availableShares'],
				properties: {
					name: { type: 'string' },
					type: { type: 'string', enum: ['SOCAN', 'SOPROQ'] },
					description: { type: 'string' },
					totalPrice: { type: 'number' },
					availableShares: { type: 'integer', maximum: 100, minimum: 0 },
				},
				additionalProperties: false,
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: async function createStock(req, res) {
			const stock = new Stock(req.body)
			return await stock.save()
		},
	})

	fastify.route({
		method: 'PATCH',
		url: '/stocks/:stock_id',
		schema: {
			description: 'Update a stock by ID',
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					type: { type: 'string', enum: ['SOCAN', 'SOPROQ'] },
					description: { type: 'string' },
					totalPrice: { type: 'number' },
					availableShares: { type: 'integer', maximum: 100, minimum: 0 },
				},
				additionalProperties: false,
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: async function createStock(req, res) {
			const stock = await Stock.ensureExistsAndRetrieve(req.params.stock_id)
			stock.patch(req.body)
			return await stock.save()
		},
	})
}

module.exports = routes
