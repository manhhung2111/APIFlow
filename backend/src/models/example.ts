import {model, Schema} from "mongoose";
import {DExample} from "@db-schemas";

const schema = new Schema<DExample>({
	user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},

	request_id: {type: Schema.Types.ObjectId, ref: "Request", required: true},
	folder_id: {type: Schema.Types.ObjectId, ref: "Folder", default: null},
	collection_id: {type: Schema.Types.ObjectId, ref: "Collection", required: true},
	workspace_id: {type: Schema.Types.ObjectId, ref: "Workspace", required: true},

	name: {type: String, required: true},

	request: Schema.Types.Mixed,
	response: Schema.Types.Mixed,

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const ExampleModel = model("Example", schema);
export default ExampleModel;
