const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../config")
const PasswordUtil = require("../utils/password")
const JWT = require("../utils/jwt")
const EmailVerification = require("../models/emailVerification")
const Notification = require("../models/notifications/notification")
const AccountStatus = require("../constants/accountStatus")
const { sendTemplateTo, normalizeEmailAddress } = require("../utils/email")
const { generateRandomCode } = require("../utils/random")
const Errors = require("../routes/errors")
const { sendSMSTo } = require("../service/twilio")
const {
	UserTemplates,
	generateTemplate,
} = require("../models/notifications/templates")

const JWT_RESET_TYPE = "user:password-reset"
const JWT_ACTIVATE_TYPE = "user:activate"
const JWT_SPLIT_TYPE = "right-split"

/**
 * Represents a user's mobile phone in the system
 */
const MobilePhoneSchema = new mongoose.Schema(
	{
		number: String,
		isVerified: Boolean,
		verificationCode: {
			code: Number,
			createdAt: Date,
		},
	},
	{ _id: false }
)

/**
 * Represents a user's permission set in the system
 */
const PermissionSchema = new mongoose.Schema(
	{
		isAdmin: Boolean,
		users: [String],
	},
	{ _id: false }
)

const ProfessionalIdentitySchema = new mongoose.Schema(
	{
		ids: [
			new mongoose.Schema(
				{
					name: {
						type: String,
						lowercase: true,
						trim: true,
					},
					value: String,
				},
				{ _id: false }
			),
		],
		public: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
)

/**
 * Represents a user / login in the system
 */
const UserSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "user_id",
			default: uuid,
		},
		password: String, //bcrypt
		firstName: String,
		lastName: String,
		artistName: String,
		avatar: Buffer,
		isni: String,
		birthDate: String,
		address: String,
		organisations: [String],
		projects: [String],
		uri: String,
		emails: {
			type: [String],
			lowercase: true,
			trim: true,
		},
		accountStatus: {
			type: String,
			default: AccountStatus.EMAIL_VERIFICATION_PENDING,
			enum: AccountStatus.list,
		},
		locale: {
			type: String,
			default: "en",
			enum: ["fr", "en"],
		},
		mobilePhone: {
			type: MobilePhoneSchema,
			default: {},
		},
		notifications: {
			type: Notification.Schema,
			default: {},
		},
		permissions: {
			type: PermissionSchema,
			default: {},
		},
		professionalIdentity: {
			type: ProfessionalIdentitySchema,
			default: {},
		},
		collaborators: {
			type: [String],
			ref: "User",
		},
	},
	{ toJSON: { virtuals: true } }
)

/**
 * Define a virtual property that makes a reference to EmailVerification documents
 */
UserSchema.virtual("pendingEmails", {
	ref: "EmailVerification",
	localField: "_id",
	foreignField: "user",
})

/**
 * Returns the full name of the user (Firstname + Lastname)
 */
UserSchema.virtual("fullName").get(function () {
	if (this.firstName && this.lastName)
		return this.firstName + " " + this.lastName

	if (this.firstName) return this.firstName

	if (this.lastName) return this.lastName

	return "Guest"
})

/**
 * Returns the primary email of this user
 */
UserSchema.virtual("email").get(function () {
	if (this.emails.length) return this.emails[0]
	return null
})

/**
 * Returns an email object of {name, email} to send email to/from this user
 */
UserSchema.virtual("$email").get(function () {
	return {
		name: this.fullName || this.email,
		email: this.email,
	}
})

/**
 * Returns the user's avatarUrl
 */
UserSchema.virtual("avatarUrl").get(function () {
	if (!this.avatar) return undefined
	return Config.apiUrl + "/users/" + this._id + "/avatar"
})

/**
 * Returns whether the current user is an administrator
 */
UserSchema.virtual("isAdmin").get(function () {
	if (!this.permissions) return false
	return this.permissions.isAdmin
})

/**
 * Returns whether the current account status is active
 */
UserSchema.virtual("isActive").get(function () {
	return this.accountStatus === AccountStatus.ACTIVE
})

/**
 * Returns whether the current account status is deleted
 */
UserSchema.virtual("isDeleted").get(function () {
	return this.accountStatus === AccountStatus.DELETED
})

/**
 * Returns whether this account can be activated with an account activation token
 */
UserSchema.virtual("canActivate").get(function () {
	return AccountStatus.activableStatus.includes(this.accountStatus)
})

/**
 * Filters account that are considered active
 */
UserSchema.query.byActive = function () {
	this.where({
		accountStatus: AccountStatus.ACTIVE,
	})
}

/**
 * Looks up the database for a user by email address
 */
UserSchema.query.byEmail = function (email) {
	return this.where({ emails: normalizeEmailAddress(email) })
}

/**
 * Looks up the database for a user by mobile phone
 */
UserSchema.query.byMobilePhone = function (number, isVerified) {
	const query = this.where({ "mobilePhone.number": number })
	if (typeof isVerified === "boolean")
		return query.where({ "mobilePhone.isVerified": isVerified })
	return query
}

/**
 * Looks up a user by a password reset token.
 */
UserSchema.query.byPasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)

	if (!data)
		// no way to easily make it just return `null`
		return this.where({ _id: null }).skip(1).limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password,
		})
}

/**
 * Looks up a user by an account activation token.
 */
UserSchema.query.byActivationToken = function (token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)

	if (!data) return this.where({ _id: false }).skip(1).limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password,
		})
}

UserSchema.methods.getCollaboratorsByDegrees = async function (degree = 0) {
	if (!this.populated("collaborators"))
		await this.populate("collaborators").execPopulate()
	let collaboratorMap = [this.collaborators]
	for (let d = 1; d <= degree; d++) {
		if (collaboratorMap[d - 1].length < 0) break
		let promises = []
		collaboratorMap[d] = []
		for (let c of collaboratorMap[d - 1])
			promises.push(c.populate("collaborators").execPopulate())
		for (const c of await Promise.all(promises))
			collaboratorMap[d] = collaboratorMap[d].concat(c.collaborators)
	}
	return collaboratorMap
}

UserSchema.methods.getCollaborators = async function (
	degree = 0,
	search_terms = "",
	limit = 1,
	skip = 0
) {
	const collaboratorMap = await this.getCollaboratorsByDegrees(degree)

	let regex = ""
	if (search_terms) {
		let s_t = [search_terms]
		if (search_terms.includes(" ")) s_t = s_t.concat(search_terms.split(" "))
		regex = new RegExp(s_t.join("|"))
	}
	const regexMatchCondition = {
		$or: [
			{ firstName: { $regex: regex, $options: "i" } },
			{ lastName: { $regex: regex, $options: "i" } },
			{ artistName: { $regex: regex, $options: "i" } },
		],
	}
	let result = []
	let _limit = limit + skip
	let visitedIds = []

	for (let collaborators of collaboratorMap) {
		if (_limit < 1) break
		let ids = []
		for (let collab of collaborators) {
			if (!visitedIds.includes(collab._id)) {
				ids.push(collab._id)
				visitedIds.push(collab._id)
			}
		}
		const matches = await User
			.find({
				$and: [{ _id: { $in: ids } }, regexMatchCondition],
			})
			.limit(_limit)

		_limit = _limit - matches.length
		result = result.concat(matches)
	}

	if (_limit > 1) {
		visitedIds.push(this._id)
		const matches = await User
			.find({
				$and: [{ _id: { $nin: visitedIds } }, regexMatchCondition],
			})
			.limit(_limit)
		result = result.concat(matches)
	}

	result.splice(0, skip)
	return result
}

/**
 * Adds an email address of a user as pending
 */
UserSchema.methods.hasAccessToUser = function (user_id) {
	if (this._id === user_id) return true
	return (
		Array.isArray(this.permissions.users) &&
		this.permissions.users.includes(user_id)
	)
}

/**
 * Sets the user's password
 */
UserSchema.methods.setPassword = async function (password, force = false) {
	if (!force && (await this.verifyPassword(password))) return false

	this.password = await PasswordUtil.hash(password)
	return true
}

/**
 * Sets the user's mobile phone
 */
UserSchema.methods.setMobilePhone = async function (number) {
	if (number === "") {
		this.mobilePhone = undefined
		return
	}
	if (
		this.mobilePhone &&
		this.mobilePhone.number === number &&
		this.mobilePhone.isVerified
	)
		return

	if (await User.findOne().byMobilePhone(number, true))
		throw Errors.ConflictingUserPhoneNumber

	this.mobilePhone = {
		number: number,
		isVerified: false,
		verificationCode: { code: generateRandomCode(), createdAt: new Date() },
	}

	this.sendSMS(UserTemplates.VERIFY_MOBILE_PHONE, false, false)
}

/**
 * Sets the user's profesional identity
 */
UserSchema.methods.setProfessionalIdentity = function (professionalIdentity) {
	if (Array.isArray(professionalIdentity.ids)) {
		let map = {}
		professionalIdentity.ids.forEach(function (id) {
			if (id.name.length && id.value.length)
				map[id.name.toLowerCase().trim()] = id.value
		})
		this.professionalIdentity.ids = []
		for (const [name, value] of Object.entries(map))
			this.professionalIdentity.ids.push({ name, value })
	}

	if (typeof professionalIdentity.public === "boolean")
		this.professionalIdentity.public = professionalIdentity.public
}

UserSchema.methods.setNotifications = function (notifications) {
	for (const type of NotificationTypes.list) {
		if (!Array.isArray(notifications[type])) continue
		if (NotificationTypes.mandatoryTypes.includes(type))
			this.notifications[type] = Array.from(
				new Set([...notifications[type], "email", "push"])
			)
		else this.notifications[type] = notifications[type]
	}
}

/*
 * Sets the user's avatar
 */
UserSchema.methods.setAvatar = function (avatar) {
	if (avatar.length > 1024 * 1024 * 4 /* 4 MB */)
		throw new Error("Maximum file size is 4 MB")

	this.avatar = avatar
}

/*
 * Sets the user's primary email
 */
UserSchema.methods.setPrimaryEmail = function (email) {
	email = normalizeEmailAddress(email)
	const index = this.emails.indexOf(email)
	if (index < 0) throw Errors.EmailNotFound
	this.emails.splice(index, 1)
	this.emails = [email, ...this.emails]
}

/**
 * Add collaborators to the user
 */
UserSchema.methods.addCollaborators = async function (collaboratorIds) {
	let promises = []
	for (const uid of collaboratorIds) {
		if (!this.collaborators.includes(uid) && uid !== this._id) {
			promises.push(User.ensureExist(uid))
			this.collaborators.push(uid)
		}
	}
	await Promise.all(promises)
}

/**
 * Adds an email address of the user as pending and returns the email object if successfully created, null otherwise
 */
UserSchema.methods.addPendingEmail = async function (
	email,
	template = UserTemplates.ACTIVATE_EMAIL,
	options = {}
) {
	let [duplicate, emailVerif] = await Promise.all([
		User.findOne().byEmail(email),
		EmailVerification.findOne().byEmail(email).populate("user"),
	])

	if (duplicate) throw Errors.ConflictingEmail

	let expireDate = new Date(Date.now() - 60 * 60 * 1000)

	if (emailVerif) {
		// If email exists, belongs to an other user and was created less than an hour ago, then throw
		if (
			emailVerif.user &&
			emailVerif.user._id !== this._id &&
			emailVerif.createdAt > expireDate
		)
			throw Errors.ConflictingEmail
		// Delete it otherwise
		else await EmailVerification.deleteOne().byEmail(email)
	}

	emailVerif = new EmailVerification({
		_id: email,
		user: this._id,
	})

	if (
		Array.isArray(this.pendingEmails) &&
		!this.pendingEmails.find((item) => item._id === emailVerif._id)
	)
		this.pendingEmails.push(emailVerif)

	await emailVerif.save()

	this.sendNotification(template, {
		...options,
		to: { name: this.fullName, email: emailVerif._id },
	})

	return emailVerif
}

UserSchema.methods.update = async function (data) {
	let promises = []

	if (data.password)
		// password cannot be empty string
		promises[0] = this.setPassword(data.password)
	if (data.phoneNumber !== undefined)
		promises[1] = this.setMobilePhone(data.phoneNumber)
	if (data.email)
		// email cannot be empty string
		promises[2] = this.addPendingEmail(
			data.email,
			this.emails.length > 0
				? UserTemplates.ACTIVATE_EMAIL
				: UserTemplates.ACTIVATE_ACCOUNT
		)

	const [hasPasswordChanged] = await Promise.all(promises)

	if (hasPasswordChanged) this.sendNotification(UserTemplates.PASSWORD_CHANGED)

	if (data.professionalIdentity !== undefined)
		this.setProfessionalIdentity(data.professionalIdentity)
	if (data.avatar !== undefined)
		this.setAvatar(Buffer.from(data.avatar, "base64"))
	if (data.notifications !== undefined)
		this.setNotifications(data.notifications)

	for (let field of [
		"firstName",
		"lastName",
		"artistName",
		"locale",
		"isni",
		"birthDate",
		"address",
		"organisations",
		"projects",
		"uri",
	])
		if (data[field] !== undefined) this[field] = data[field]
}

/**
 * Remove a pending email address of the user
 */
UserSchema.methods.deletePendingEmail = async function (email) {
	email = normalizeEmailAddress(email)

	const result = await EmailVerification.deleteOne().byEmailUserId(
		email,
		this._id
	)

	if (result.deletedCount < 1) return false

	if (this.populated("pendingEmails"))
		this.pendingEmails.filter((e) => e.email === email)

	return true
}

/**
 * Remove an email address of the user
 */
UserSchema.methods.deleteEmail = async function (email) {
	email = normalizeEmailAddress(email)

	if (!this.emails.includes(email)) return await this.deletePendingEmail(email)

	if (this.emails.length === 1) throw Errors.DeleteNotAllowed

	this.emails.splice(this.emails.indexOf(email), 1)

	return true
}

/**
 * Delete a collaborator by ID
 */
UserSchema.methods.deleteCollaboratorById = function (id) {
	const n = this.collaborators.length
	this.collaborators = this.collaborators.filter(function (item) {
		if (typeof item === "string") return item !== id
		return item._id !== id
	})
	return n > this.collaborators.length
}

/**
 * Delete the user's account
 */
UserSchema.methods.deleteAccount = async function () {
	await EmailVerification.deleteMany({ user: this._id })
	this.accountStatus = AccountStatus.DELETED
	this.locale = "en"
	this.password = undefined
	this.emails = undefined
	this.firstName = undefined
	this.lastName = undefined
	this.artistName = undefined
	this.avatar = undefined
	this.mobilePhone = undefined
	this.permissions = undefined
	this.professionalIdentity = undefined
	this.collaborators = undefined
	await this.save()
}

/**
 * Verifies the password of the current user
 */
UserSchema.methods.verifyPassword = async function (password) {
	return await PasswordUtil.verify(password, this.password)
}

/**
 * Verifies the verification code of the user's mobile phone
 */
UserSchema.methods.verifyMobilePhone = async function (code) {
	if (!this.mobilePhone) throw Errors.UserMobilePhoneNotFound
	if (!this.mobilePhone.verificationCode) throw Errors.InvalidVerificationCode
	if (this.mobilePhone.isVerified) throw Errors.MobilePhoneAlreadyActivated
	if (
		await User
			.findOne({ _id: { $ne: this._id } })
			.byMobilePhone(this.mobilePhone.number, true)
	)
		throw Errors.ConflictingUserPhoneNumber

	const expireDate = new Date(
		this.mobilePhone.verificationCode.createdAt.getTime() +
			24 * 60 * 60 * 1000 /* 24h */
	)

	if (expireDate < new Date() || this.mobilePhone.verificationCode.code != code)
		throw Errors.InvalidVerificationCode

	this.mobilePhone.isVerified = true
	this.mobilePhone.verificationCode = undefined
}

/**
 * Verifies a password reset token for the user
 */
UserSchema.methods.verifyPasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	return data && data.user_id == this._id
}

/**
 * Creates a password reset token for the user
 */
UserSchema.methods.createPasswordResetToken = function (
	email,
	expires = "2 hours"
) {
	return JWT.create(
		JWT_RESET_TYPE,
		{
			user_id: this._id,
			user_password: this.password,
			user_email: normalizeEmailAddress(email),
		},
		expires
	)
}

/**
 * Creates an activation token to verify the user's email address
 */
UserSchema.methods.createActivationToken = function (
	email,
	expires = "2 weeks"
) {
	const token = JWT.create(
		JWT_ACTIVATE_TYPE,
		{
			user_id: this.user_id,
			user_password: this.password,
			user_email: normalizeEmailAddress(email),
		},
		expires
	)
	return token
}

UserSchema.methods.createCollaborator = async function (data) {
	let collaborator = await User.findOne().byEmail(data.email)

	if (!collaborator) {
		let emailVerif = await EmailVerification.findOne()
			.byEmail(data.email)
			.populate("user")

		if (emailVerif && emailVerif.user) collaborator = emailVerif.user
		else {
			collaborator = new User({
				firstName: data.email.split("@")[0],
				...data,
			})
			await collaborator.addPendingEmail(data.email, UserTemplates.INVITED, {
				collaborator: this,
			})
			await collaborator.save()
		}
	}

	if (collaborator._id !== this._id) this.collaborators.push(collaborator._id)

	return collaborator
}

/**
 * Decode a password reset token for the user
 */
UserSchema.methods.decodePasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	if (!data || data.user_id !== this._id) return null
	return data
}

/*
 * Sends a notification to the user through the medium set in the user's preferences
 */
UserSchema.methods.sendNotification = function (templateName, options = {}) {
	this.sendSMS(templateName).catch((err) =>
		console.log("Error while sending SMS notification: " + err)
	)
	this.sendEmail(templateName, options).catch((err) =>
		console.log("Error while sending email notification: " + err + err.stack)
	)
	/*this.sendPush(templateName).catch((err) =>
		console.log("Error while sending push notification: " + err)
	)*/
}

/**
 * Sends an SMS to the user
 */
UserSchema.methods.sendSMS = async function (
	templateName,
	verifiedOnly = true,
	checkNotif = true
) {
	const template = generateTemplate(templateName, "sms", this)

	if (
		!template ||
		(checkNotif &&
			!this.notifications[template.notificationType].includes("sms"))
	)
		return null

	return await sendSMSTo(this, template.message, verifiedOnly)
}

/**
 * Sends an Email to the user
 */
UserSchema.methods.sendEmail = async function (templateName, options = {}) {
	const template = generateTemplate(templateName, "email", this, options)

	if (
		!template ||
		!this.notifications[template.notificationType].includes("email")
	)
		return null

	return await sendTemplateTo(template.id, this, options, template.data)
}

/**
 * Sends a Push notification to the user
 */
UserSchema.methods.sendPush = function (templateName) {
	return "push not implemented"
}

UserSchema.statics.ensureExist = function (uid) {
	return this.exists({ _id: uid }).then((exist) => {
		if (!exist) return Promise.reject(Errors.UserNotFound)
		else return Promise.resolve(uid)
	})
}

UserSchema.statics.activate = async function (token, checkPassword = true) {
	const email = await EmailVerification.findOne().byActivationToken(
		token,
		checkPassword
	)
	const user = email.user

	if (!email) throw Errors.InvalidActivationToken
	if (await User.findOne().byEmail(email._id)) throw Errors.EmailAlreadyActivated

	user.accountStatus = AccountStatus.ACTIVE
	user.emails.push(email._id)

	await email.remove()

	return user
}

UserSchema.statics.create = async function (data) {
	data = {
		firstName: data.email.split("@")[0],
		...data,
	}

	let user
	let emailVerif = await EmailVerification.findOne()
		.byEmail(data.email)
		.populate("user")

	if (emailVerif) {
		if (!emailVerif.user) await emailVerif.remove()
		else if (await emailVerif.user.verifyPassword(data.password))
			user = emailVerif.user
	}

	if (!user) {
		user = new User()
		await user.setPassword(data.password, true)
		data.password = undefined
		await user.update(data)
	}

	await user.save()
	return user
}

const User = mongoose.model("User", UserSchema)

module.exports = User
