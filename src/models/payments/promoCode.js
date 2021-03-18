const uuid = require("uuid").v4
const mongoose = require("mongoose")
const localeSchema = require("../locale")

const PromoCodeSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "promoCode_id",
			default: uuid,
		},
		code: String,
		organisation: localeSchema,
		description: localeSchema,
		value: Number,
		expires: Date,
	},
	{ toJSON: { virtuals: true } }
)

module.exports = mongoose.model("PromoCode", PromoCodeSchema)
