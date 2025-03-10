import {model, Schema} from "mongoose";
import {DFolder} from "@db-schemas";

const schema = new Schema<DFolder>({
	user_id: {type: String, required: true, index: true},
	workspace_id: {type: String, required: true, index: true},
	collection_id: {type: String, required: true, index: true},

	name: {type: String, required: true},
	content: {type: String, default: ""},

	authorization: {
		type: {type: Number, enum: [0, 1, 2, 3, 4], default: 0},
		data: {type: Schema.Types.Mixed, default: {}},
	},

	scripts: {
		pre_request: {type: String, default: ""},
		post_response: {type: String, default: ""},
	},

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
	minimize: false,
});


const FolderModel = model("Folder", schema);
export default FolderModel;
