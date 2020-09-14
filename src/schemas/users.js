const Notifications = require("../models/notifications/notification")

module.exports = {
	user: {
		type: "object",
		properties: {
			user_id: {
				type: "string",
			},
			firstName: {
				type: "string",
			},
			lastName: {
				type: "string",
			},
			artistName: {
				type: "string",
			},
			email: {
				type: "string",
			},
			accountStatus: {
				type: "string",
				enum: [
					"invalid",
					"email-verification-pending",
					"split-invited",
					"active",
					"deleted",
				],
			},
			mobilePhone: this.mobilePhone,
			permissions: this.permissions,
			locale: {
				type: "string",
				enum: ["en", "fr"],
			},
			avatarUrl: {
				type: "string",
			},
			notifications: this.notifications
		},
	},

	rightHolder: {
		type: "object",
		properties: {
			rightHolder_id: {
				type: "string",
			},
			firstName: {
				type: "string",
			},
			lastName: {
				type: "string",
			},
			artistName: {
				type: "string",
			},
			email: {
				type: "string",
			},
		},
	},

	userRequestBody: {
		type: "object",
		properties: {
			email: {
				type: "string",
			},
			password: {
				type: "string",
			},
			artistName: {
				type: "string",
			},
			firstName: {
				type: "string",
			},
			lastName: {
				type: "string",
			},
			phoneNumber: {
				type: "string",
			},
			avatar: {
				type: "string",
			},
			locale: {
				type: "string",
				enum: ["en", "fr"],
			}
		},
	},

	mobilePhone: {
		type: "object",
		properties: {
			number: {
				type: "string",
			},
			status: {
				type: "string",
				enum: ["verified", "unverified"],
			},
		},
	},

	permissions: {
		type: "object",
		properties: {
			admin: {
				type: "boolean",
			},
			users: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},		
	},

	notifications: {
		type: "object",
		properties: {
			[Notifications.GENERAL_INTERATIONS]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: ["email", "push"],
			},
			[Notifications.ADMINISTRATIVE_MESSAGES]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: ["email", "push"],
			},
			[Notifications.ACCOUNT_LOGIN]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: [],
			},
			[Notifications.SMARTSPLIT_BLOG]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: [],
			},
			[Notifications.SMARTSPLIT_PROMOTIONS]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: [],
			},
			[Notifications.PARTNER_PROMOTIONS]: {
				type: "array",
				items: {
					type: "string",
					enum: ["email", "push", "sms"],
				},
				default: [],
			},
		},
	},
}
