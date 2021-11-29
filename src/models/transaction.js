const uuid = require('uuid').v4
const mongoose = require('mongoose')
const User = require('./user')

const TransactionSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuid,
		},
		amount: Number,
		type: {
			type: String,
			enum: ['SOCAN', 'SOPROQ'],
		},
		ownerId: {
			type: String,
			required: true,
			validate: function validator(val) {
				return User.ensureExists(val)
			},
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

TransactionSchema.virtual('owner', {
	ref: 'User',
	localField: 'ownerId',
	foreignField: '_id',
	justOne: true,
	autopopulate: true,
})

module.exports = mongoose.model('Transaction', TransactionSchema)
