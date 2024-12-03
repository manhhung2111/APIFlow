import {model, Schema} from "mongoose";
import {DActivityLog} from "@db-schemas";

const schema = new Schema<DActivityLog>({
	user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
	meta_type: {type: String, required: true},

	name: String,
	action: String,
	tag: String,

	obj_key: {type: String, required: true, unique: true},
	obj_type: String,
	obj_export: Schema.Types.Mixed,

	data: Schema.Types.Mixed,
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const ActivityLogModel = model("ActivityLog", schema);
export default ActivityLogModel;
