const User = require('../../models/user')
const { UserTemplates } = require('../../models/notificationTemplates')
const EmailVerification = require('../../models/emailVerification')
const UserSchema = require('../../schemas/users')
const AuthSchema = require('../../schemas/auth')
const AccountStatus = require('../../constants/accountStatus')
const Errors = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const zumrails = require('../../service/zumrails')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/users/:user_id',
		schema: {
			tags: ['users_general'],
			description: 'Get a user by ID',
			params: {
				user_id: { type: 'string' },
			},
			response: {
				200: UserSchema.serialization.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getUserById,
	})

	fastify.route({
		method: 'GET',
		url: '/users/:user_id/avatar',
		schema: {
			tags: ['users_general'],
			description: "Get a user's avatar by ID",
			params: {
				user_id: { type: 'string' },
			},
		},
		reponse: {
			200: {},
		},
		handler: getUserAvatar,
	})

	fastify.route({
		method: 'POST',
		url: '/users/',
		schema: {
			tags: ['users_general'],
			description: 'Create a new user in the system',
			body: UserSchema.validation.createUser,
			response: {
				201: UserSchema.serialization.user,
			},
		},
		handler: createUser,
	})

	fastify.route({
		method: 'POST',
		url: '/users/activate',
		schema: {
			tags: ['users_general'],
			description: "Activate a user's account",
			body: {
				type: 'object',
				required: ['token'],
				properties: {
					token: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
			dbOperation: 'update',
		},
		handler: activateUserAccount,
	})

	fastify.route({
		method: 'POST',
		url: '/users/activate-invited',
		schema: {
			tags: ['users_general'],
			description:
				'Finish the registration of the user that have been invited to create an account',
			body: {
				type: 'object',
				required: ['token', 'password'],
				properties: {
					token: { type: 'string' },
					password: { type: 'string' },
					firstName: { type: 'string' },
					lastName: { type: 'string' },
					artistName: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
			dbOperation: 'update',
		},
		handler: activateInvitedUserAccount,
	})

	fastify.route({
		method: 'PATCH',
		url: '/users/:user_id',
		schema: {
			tags: ['users_general'],
			description: 'Update a user by ID',
			params: {
				user_id: { type: 'string' },
			},
			body: UserSchema.validation.updateUser,
			response: {
				200: UserSchema.serialization.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: updateUser,
	})

	fastify.route({
		method: 'PUT',
		url: '/users/:user_id/zumId',
		schema: {
			tags: ['users'],
			description: 'Link a zumrails user ID to a smartsplit user',
			body: {
				type: 'object',
				required: ['zumId'],
				properties: {
					zumId: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: UserSchema.serialization.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: linkUserToZumId,
	})

	fastify.route({
		method: 'POST',
		url: '/users/request-password-reset',
		schema: {
			tags: ['users_general'],
			description: 'Send a password reset email',
			body: {
				type: 'object',
				required: ['email'],
				properties: {
					email: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
			dbOperation: 'noop',
		},
		handler: requestPasswordReset,
	})

	fastify.route({
		method: 'POST',
		url: '/users/change-password',
		schema: {
			tags: ['users_general'],
			description: 'Update the user password',
			body: {
				type: 'object',
				required: ['password'],
				properties: {
					token: { type: 'string' },
					currentPassword: { type: 'string' },
					password: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
			security: [{ bearerAuth: [] }],
			dbOperation: 'update',
		},
		handler: changeUserPassword,
	})

	fastify.route({
		method: 'POST',
		url: '/users/verify-mobile-phone',
		schema: {
			tags: ['users_general'],
			description: "Verify the user's phone number",
			body: {
				type: 'object',
				required: ['verificationCode'],
				properties: {
					verificationCode: { type: 'number' },
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
			dbOperation: 'update',
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: verifyUserMobilePhone,
	})

	fastify.route({
		method: 'DELETE',
		url: '/users/:user_id',
		schema: {
			tags: ['users_general'],
			description: "Delete a user's account by ID",
			params: {
				user_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: deleteUserAccount,
	})
}

/************************ Handlers ************************/

const getUser = async function (req) {
	if (req.authUser && req.authUser._id === req.params.user_id)
		return req.authUser

	return await User.ensureExistsAndRetrieve(req.params.user_id)
}

const getUserById = async function (req, res) {
	const user = await getUser(req)

	if (
		!req.authUser ||
		(req.authUser && !req.authUser.hasAccessToUser(user._id))
	)
		res.schema(UserSchema.serialization.publicUser)
	else
		await user
			.populate(['paymentInfo.billingAddress', 'addresses'])
			.execPopulate()

	return user
}

const getUserWithAuthorization = async function (req) {
	if (req.authUser && req.authUser._id === req.params.user_id)
		return req.authUser

	const user = await getUser(req)

	if (
		!req.authUser ||
		(req.authUser && !req.authUser.hasAccessToUser(user._id))
	)
		throw Errors.UserForbidden

	return user
}

async function getUserAvatar(req, res) {
	const user = await getUser(req)
	res.header('Content-Type', 'image/jpeg') // hardcoded for the moment
	return user.avatar
}

async function createUser(req, res) {
	const user = await User.create(req.body)
	req.setTransactionResource(user)
	res.code(201)
	return user
}

async function activateUserAccount(req, res) {
	const user = await User.activate(req.body.token)
	req.setTransactionResource(user)
	await user.save()
	return { accessToken: JWTAuth.createToken(user), user: user }
}

async function activateInvitedUserAccount(req, res) {
	const user = await User.activate(req.body.token)
	const password = req.body.password
	req.body.password = undefined
	req.setTransactionResource(user)

	await Promise.all([user.update(req.body), user.setPassword(password, true)])

	await user.save()

	return { accessToken: JWTAuth.createToken(user), user: user }
}

async function updateUser(req, res) {
	const user = await getUserWithAuthorization(req)
	req.setTransactionResource(user)

	await user.update(req.body)
	await user.save()

	return user
}

async function requestPasswordReset(req, res) {
	let user = await User.findOne().byEmail(req.body.email)

	if (!user) {
		const email = await EmailVerification.findOne()
			.byEmail(req.body.email)
			.populate('user')

		if (!email) throw Errors.EmailNotFound

		user = email.user
	}

	user.sendNotification(UserTemplates.PASSWORD_RESET, {
		to: { name: user.fullName, email: req.body.email },
	})

	res.code(204).send()
}

async function changeUserPassword(req, res) {
	let user
	if (req.body.token) {
		user = await User.findOne().byPasswordResetToken(req.body.token)
		if (!user) throw Errors.InvalidResetToken
	} else {
		user = await JWTAuth.requireAuthUser(req, res)
		if (
			!req.body.currentPassword ||
			!(await user.verifyPassword(req.body.currentPassword))
		)
			throw Errors.InvalidCurrentPassword
	}

	req.setTransactionResource(user)

	if (await user.setPassword(req.body.password))
		user.sendNotification(UserTemplates.PASSWORD_CHANGED)

	if (user.accountStatus === AccountStatus.EMAIL_VERIFICATION_PENDING) {
		user.accountStatus = AccountStatus.ACTIVE
		const data = user.decodePasswordResetToken(req.body.token)
		if (await user.deletePendingEmail(data.user_email))
			user.emails.push(data.user_email)
	}

	await user.save()

	return { accessToken: JWTAuth.createToken(user), user }
}

async function verifyUserMobilePhone(req, res) {
	req.setTransactionResource(req.authUser)
	await req.authUser.verifyMobilePhone(req.body.verificationCode)
	res.code(204).send()
}

async function deleteUserAccount(req, res) {
	const user = await getUserWithAuthorization(req)
	req.setTransactionResource(user)

	if (user.isDeleted) throw Errors.AccountAlreadyDeleted

	await user.deleteAccount()

	res.code(204).send()
}

async function linkUserToZumId(req, res) {
	const user = await getUserWithAuthorization(req)
	await zumrails.getUserById(req.body.zumId)
	user.zumId = req.body.zumId
	return await user.save()
}

module.exports = {
	routes,
	getUserWithAuthorization,
}
