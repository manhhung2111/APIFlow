import {model, Schema} from "mongoose";
import {DCollection} from "@db-schemas";

const schema = new Schema<DCollection>({
	user_id: {type: String, required: true},
	workspace_id: {type: String, required: true},

	name: {type: String, required: true},
	content: String,

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
