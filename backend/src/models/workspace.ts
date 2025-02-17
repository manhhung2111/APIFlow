import {model, Schema} from "mongoose";
import {DWorkspace} from "@db-schemas";

const schema = new Schema<DWorkspace>({
	user_id: {type: String, required: true},

	name: {type: String, required: true},
	content: {type: String, default: ""},

	viewers: {type: [String], index: true},
	commenters: {type: [String], index: true},
	editors: {type: [String], index: true},

	data: {type: Schema.Types.Mixed, default: {}},
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
