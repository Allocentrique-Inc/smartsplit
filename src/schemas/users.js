const { api, error } = require("../app")
const User = require("../models/user")

module.exports = {
	id: api.param("user_id", {
		in: "path",
		name: "user_id",
		description: "The ID of the user, or the special value \"session\" to use the currently authenticated user",
		example: "session"
	}),
	
	user: api.schemaFromModel("user", User),
	
	requestPasswordReset: api.schema("user_password_reset", {
		type: "object",
		required: ["email"],
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "valaire@smartsplit.org"
			}
		}
	}),
	
	passwordChange: api.schema("user_change_password", {
		type: "object",
		required: ["password"],
		properties: {
			token: {
				type: "string",
				format: "jwt"
			},
			
			password: {
				type: "string",
				format: "password"
			}
		}
	}),
	
	UserNotFoundError:
		error("user_not_found", 404, "User not found"),
	
	ConflictingUserError:
		error("user_conflict",  409, "A user already exists with this ID or email address"),
	
	UserForbidden:
		error("user_forbidden", 403, "The currently authorized user is not allowed to access this user"),
	
	InvalidResetToken:
		error("user_invalid_reset_token", 403, "The supplied password reset token is not valid or has expired"),
}
		
	

/*module.exports.user_register = module.exports.user.extend("user_register", {
	required: ["email", "password", "locale"]
})*/