const uuid = require('uuid').v4
const mongoose = require('mongoose')
const User = require('./user')

const StockSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuid,
		},
		name: String,
		type: {
			type: String,
			enum: ['SOCAN', 'SOPROQ'],
		},
		description: String,
		totalPrice: Number,
		availableShares: Number,
		isPublished: {
			type: Boolean,
			default: false,
		},
		ownerId: {
			type: String,
			validate: function validator(val) {
				return User.ensureExists(val)
			},
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

StockSchema.virtual('owner', {
	ref: 'User',
	localField: 'ownerId',
	foreignField: '_id',
	justOne: true,
	autopopulate: true,
})

module.exports = mongoose.model('Stock', StockSchema)
