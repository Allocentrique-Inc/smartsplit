const mongoose = require('mongoose')
const uuid = require('uuid').v4

const EditorSplitSchema = new mongoose.Schema(
	{
		workpiece: {
			type: String,
			alias: 'workpiece_id',
			ref: 'Workpiece',
		},
		rightHolder: {
			type: String,
			alias: 'rightHolder_id',
			ref: 'User',
		},
		editor: {
			type: String,
			ref: 'User',
			autopopulate: true,
		},
		hasEditor: Boolean,
		shares: Number,
		_state: {
			type: String,
			enum: ['draft', 'pending', 'accepted', 'rejected'],
			default: 'draft',
		}
	},
	{ _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

EditorSplitSchema.virtual('editor_id').get(function () {
	if(!this.hasEditor) return undefined
	if(typeof this.editor === 'string') return this.editor
	if(typeof this.editor === 'object') return this.editor.id
	return undefined
})

module.exports = mongoose.model('EditorSplit', EditorSplitSchema)
