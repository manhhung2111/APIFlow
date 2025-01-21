import {model, Schema} from "mongoose";
import {DWorkspace} from "@db-schemas";

const schema = new Schema<DWorkspace>({
	user_id: {type: String, required: true},

	name: {type: String, required: true},
	content: String,

	viewers: [{type: String, required: true}],
	commenters: [{type: String, required: true}],
	editors: [{type: String, required: true}],

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const WorkspaceModel = model("Workspace", schema);
export default WorkspaceModel;
