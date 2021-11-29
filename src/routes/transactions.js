const Transaction = require('../models/transaction')
const zumrails = require('../service/zumrails')
const JWTAuth = require('../service/JWTAuth')

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/transactions/zum-wallet/',
		schema: {
			description: 'Withdraw or fund money from/to zum wallet',
			body: {
				type: 'object',
				required: ['amount', 'type'],
				properties: {
					action: { type: 'string', enum: ['withdraw', 'fund'] },
					amount: { type: 'number' },
				},
				additionalProperties: false,
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function withdrawZumWallet(req, res) {
			const action = `${req.body.action}ZumWallet`
			return await zumrails[action](req.body.amount)
		},
	})

	fastify.route({
		method: 'POST',
		url: '/transactions/',
		schema: {
			description: 'Create a transaction in the system',
			body: {
				type: 'object',
				required: ['amount', 'user_id'],
				properties: {
					workpieceId: { type: 'string' },
					amount: { type: 'number' },
					type: { type: 'string', enum: ['SOCAN', 'SOPROQ'] },
				},
				additionalProperties: false,
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function createTransaction(req, res) {
			const transaction = new Transaction(req.body)
			return await transaction.save()
		},
	})
}

module.exports = routes
