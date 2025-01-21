import {model, Schema} from "mongoose";
import {DRequest} from "@db-schemas";

const schema = new Schema<DRequest>({
	user_id: {type: String, required: true},
	workspace_id: {type: String, required: true},
	collection_id: {type: String, required: true},
	folder_id: {type: Schema.Types.ObjectId, ref: "Folder", default: null},

	name: {type: String, required: true},
	content: String,

	method: {type: String, required: true, enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], default: "GET"},
	url: {type: String, required: true},

	params: [{key: String, value: String, description: String}],
	headers: [{key: String, value: String, description: String}],
	authorization: {
		authorization_type: {type: Number, enum: [0, 1, 2, 3, 4], default: 0},
		authorization_data: Schema.Types.Mixed,
	},
	body: {
		body_type: {type: Number, enum: [0, 1, 2, 3], default: 0},
		body_data: Schema.Types.Mixed,
	},
	scripts: {
		pre_script: {type: String, default: ""},
		post_script: {type: String, default: ""},
	},

	tag: {type: Number, enum: [0, 1, 2], default: 0},

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const RequestModel = model("Request", schema);
export default RequestModel;
