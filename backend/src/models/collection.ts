import {model, Schema} from "mongoose";
import {DCollection} from "@db-schemas";

const schema = new Schema<DCollection>({
	user_id: {type: String, required: true},
	workspace_id: {type: String, required: true},

	name: {type: String, required: true},
	content: String,

	authorization: {
		type: {type: Number, enum: [0, 1, 2, 3, 4], default: 0},
		data: Schema.Types.Mixed,
	},

	scripts: {
		pre_script: {type: String, default: ""},
		post_script: {type: String, default: ""},
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

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const CollectionModel = model("Collection", schema);
export default CollectionModel;
