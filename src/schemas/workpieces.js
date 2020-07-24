const { api, error } = require("../app")
const Workpiece = require("../models/workpiece")

module.exports = {
	workpiece_id: api.param("workpiece_id", {
		in: "path",
		name: "workpiece_id",
		description: "The ID of a workpiece",
		example: "e87b56ee-1ca0-4ec7-8393-e18dc7415041",
	}),

	file_id: api.param("file_id", {
		in: "path",
		name: "file_id",
		description: "The ID of a workpiece's file",
		example: "c27956ee-1bb0-4fc7-8373-a18dc8425041",
	}),

	workpiece: api.schemaFromModel("workpiece", Workpiece),

	workpieceFile: api.schemaFromModel("workpieceFile", Workpiece.File, {
		properties: {
			fileUrl: {
				type: "string",
				example:
					"https://api.smartsplit.org/workipeces/0d0cb6f9-c1e6-49e0-acbf-1ca4ace07d1c/files/e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				readOnly: true,
			},
		},
	}),

	WorkpieceNotFoundError: error(
		"workpiece_not_found",
		404,
		"Workpiece not found"
	),

	RightSplitNotFoundError: error(
		"right_split_not_found",
		404,
		"RightSplit not found"
	),
	FileNotFoundError: error("file_not_found", 404, "File not found"),

	InvalidSplitTokenError: error(
		"right_holder_invalid_token",
		403,
		"The supplied split token is not valid or has expired"
	),

	ConflictingRightSplitStateError: error(
		"conflicting_right_split_state",
		409,
		"The current state of the right split does not allow this kind of operation"
	),

	VoteAlreadySubmitedError: error(
		"vote_already_submited",
		412,
		"This right holder's vote has already been submited and cannot be submited again"
	),

	CanOnlyQueryByOwnOwnerError: error(
		"can_only_query_by_self_owner",
		403,
		"This endpoint only allows querying workpieces owned by the current API user"
	),
}

module.exports.workpieceList = api.schema("workpieceList", {
	type: "array",
	items: module.exports.workpiece,
})
