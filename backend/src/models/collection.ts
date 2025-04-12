import {model, Schema} from "mongoose";
import {DCollection} from "@db-schemas";

const schema = new Schema<DCollection>({
	user_id: {type: String, required: true, index: true},
	workspace_id: {type: String, required: true, index: true},

	name: {type: String, required: true},
	content: {type: String, default: ""},

	authorization: {
		type: {type: Number, enum: [1, 2, 3, 4, 5], default: 1},
		data: {type: Schema.Types.Mixed, default: {}},
	},

	scripts: {
		pre_request: {type: String, default: ""},
		post_response: {type: String, default: ""},
	},

	variables: [
		{
			selected: Boolean,
			variable: String,
			type: {type: String, enum: ["text", "password"], default: "text"},
			initial_value: String,
			current_value: String,
		},
	],

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


const CollectionModel = model("Collection", schema);
export default CollectionModel;
