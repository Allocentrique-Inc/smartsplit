const JWTAuth = require("../../service/JWTAuth")
const Controller = require("./handlers")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id",
		schema: {
			response: {
				200: UserSchema.user,
			},
		},
		handler: Controller.getUserWithPendingEmails,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/avatar",
		schema: {
			response: {
				200: { /* TODO */ },
			},
		},
		handler: Controller.getUserAvatar,
	})

	fastify.route({
		method: "POST",
		url: "/users/",
		schema: {
			response: {
				201: UserSchema.user,
			},
		},
		handler: Controller.createUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/activate",
		schema: {
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		handler: Controller.activateUserAccount,
	})

	fastify.route({
		method: "PATCH",
		url: "/users/:user_id",
		schema: {
			response: {
				200: UserSchema.user,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.updateUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/request-password-reset",
		handler: Controller.requestPasswordReset,
	})

	fastify.route({
		method: "POST",
		url: "/users/change-password",
		schema: {
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.changeUserPassword,
	})

	fastify.route({
		method: "POST",
		url: "/users/verify-mobile-phone",
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.verifyUserMobilePhone,
	})

	fastify.route({
		method: "POST",
		url: "/users/invite-new-user",
		schema: {
			response: {
				201: UserSchema.user,
			},
		},
		handler: Controller.inviteNewUser,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id",
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserAccount,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/emails/",
		schema: {
			response: {
				200: UserSchema.emailStatusList,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.getUserEmails,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/",
		schema: {
			response: {
				201: UserSchema.emailStatusList,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.createUserEmail,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/:email",
		handler: Controller.activateUserEmail,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/emails/:email",
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserEmail,
	})
}

module.exports = routes