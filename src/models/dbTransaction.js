const uuid = require('uuid').v4
const mongoose = require('mongoose')

const DBTransactionSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid,
	},
	request: new mongoose.Schema(
		{
			id: String,
			url: String,
			method: String,
			authorisation: String,
			userAgent: String,
			params: {
				type: Map,
				of: String,
			},
			querystring: {
				type: Map,
				of: String,
			},
			body: {
				type: Map,
				of: mongoose.Mixed,
			},
		},
		{ _id: false }
	),
	authUserId: String,
	dbOperation: {
		type: String,
		enum: ['delete', 'insert', 'update', 'noop'],
	},
	resource: mongoose.Mixed,
	resourceCollection: String,
	response: {
		type: new mongoose.Schema(
			{
				statusCode: Number,
				errorMessage: String,
			},
			{ _id: false }
		),
		default: {},
	},
	createdAt: {
		type: Date,
		expires: '30d', // 30 days
		default: Date.now,
	},
})

module.exports = mongoose.model('DBTransaction', DBTransactionSchema)
