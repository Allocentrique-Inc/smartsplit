const uuid = require("uuid").v4
const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid,
	},
	request: new mongoose.Schema(
		{
			id: Number,
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
		},
		{ _id: false }
	),
	authUserId: String,
	operation: {
		type: String,
		enum: ["delete", "insert", "update", "noop"],
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
		expires: "30d", // 30 days
		default: Date.now,
	},
})

module.exports = mongoose.model("Transaction", TransactionSchema)