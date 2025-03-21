import {model, Schema} from "mongoose";
import {DRequest} from "@db-schemas";

const schema = new Schema<DRequest>({
	user_id: {type: String, required: true, index: true},
	workspace_id: {type: String, required: true, index: true},
	collection_id: {type: String, required: true, index: true},
	folder_id: {type: String, default: null, index: true},

	name: {type: String, required: true},
	content: {type: String, default: ""},

	method: {type: String, required: true, enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], default: "GET"},
	url: {type: String, default: ""},

	params: [{selected: Boolean, key: String, value: String, content: String}],
	headers: [{selected: Boolean, key: String, value: String, content: String}],
	authorization: {
		type: {type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0},
		data: {type: Schema.Types.Mixed, default: {}},
	},
	body: {
		type: {type: Number, enum: [0, 1, 2, 3], default: 0},
		data: {type: Schema.Types.Mixed, default: {
			form_data: [],
			form_encoded: [],
			form_raw: ""
		}},
	},
	scripts: {
		pre_request: {type: String, default: ""},
		post_response: {type: String, default: ""},
	},

	tag: {type: Number, enum: [0, 1, 2], default: 0},

	data: {type: Schema.Types.Mixed, default: {}},
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
	minimize: false,
});


const RequestModel = model("Request", schema);
export default RequestModel;
