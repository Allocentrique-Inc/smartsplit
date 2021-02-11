const JWTAuth = require("../../service/JWTAuth")
const User = require("../../models/user")
const AccountStatus = require("../../constants/accountStatus")
const UserSchema = require("../../schemas/users")
const Errors = require("../errors")
const { UserTemplates } = require("../../models/notifications/templates")
const { getUser } = require("./users")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["collaborators"],
			description: "Get a user's collaborators",
			params: {
				user_id: {
					type: "string",
				},
			},
			querystring: {
				search_terms: { type: "string" },
				degree: {
					type: "integer",
					minimum: 0,
					maximum: 3,
					default: 0,
				},
				limit: {
					type: "integer",
					minimum: 1,
					maximum: 250,
					default: 50,
				},
				skip: {
					type: "integer",
					minimum: 0,
					default: 0,
				},
			},
			response: {
				200: {
					type: "array",
					items: UserSchema.userPublicProfile,
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getCollaborators,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description: "Get a user's collaborator by ID",
			params: {
				user_id: {
					type: "string",
				},
				collaborator_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.userPublicProfile,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getCollaboratorById,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["collaborators"],
			description:
				"Create a new collaborator and add it to the authenticated user's collaborators",
			params: {
				user_id: {
					type: "string",
				},
			},
			body: {
				type: "object",
				required: ["email"],
				properties: {
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
				additionalProperties: false,
			},
			response: {
				201: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: createCollaborator,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description:
				"Add an existing user to the authenticated user's collaborators",
			params: {
				user_id: {
					type: "string",
				},
				collaborator_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: addCollaboratorById,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description: "Delete a user's collaborator by ID",
			params: {
				user_id: {
					type: "string",
				},
				collaborator_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: deleteCollaboratorById,
	})
}

/************************ Handlers ************************/

async function getCollaborators(req, res) {
	const user = await getUser(req, res)
	return await user.getCollaborators(
		parseInt(req.query.degree),
		req.query.search_terms,
		parseInt(req.query.limit),
		parseInt(req.query.skip)
	)
}

async function getCollaboratorById(req, res) {
	const user = await getUser(req, res)
	if (!user.collaborators.includes(req.params.collaborator_id))
		throw Errors.CollaboratorNotFound

	const collaborator = await User.findById(req.params.collaborator_id)

	if (!collaborator.professional_identity.public)
		collab.professional_identity = undefined

	return collaborator
}

async function createCollaborator(req, res) {
	const user = await getUser(req, res)

	if (await User.findOne().byEmail(req.body.email)) throw Errors.ConflictingUser

	const collaborator = new User({
		firstName: req.body.email.split("@")[0],
		...req.body,
		accountStatus: AccountStatus.SPLIT_INVITED,
	})

	const emailVerif = await collaborator.addPendingEmail(req.body.email)

	await collaborator.save()
	await emailVerif.save()

	await collaborator.sendNotification(UserTemplates.SPLIT_INVITED, {
		to: { name: collaborator.fullName, email: emailVerif._id },
	})

	user.collaborators.push(collaborator._id)
	await user.save()

	res.code(201)
	return collaborator
}

async function addCollaboratorById(req, res) {
	const user = await getUser(req, res)

	await user.addCollaborators([req.params.collaborator_id])
	await user.save()

	return user
}

async function deleteCollaboratorById(req, res) {
	const user = await getUser(req, res)
	const index = user.collaborators.indexOf(req.params.collaborator_id)

	if (index < 0) throw Errors.CollaboratorNotFound

	user.splice(index, 1)
	await user.save()

	res.code(204).send()
}

module.exports = routes
