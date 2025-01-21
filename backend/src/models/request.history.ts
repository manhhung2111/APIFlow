import {model, Schema} from "mongoose";
import {DRequestHistory} from "@db-schemas";

const schema = new Schema<DRequestHistory>({
	user_id: {type: String, required: true},
	workspace_id: {type: String, required: true},

	request: Schema.Types.Mixed,
	response: {
		headers: Schema.Types.Mixed,
		body: Schema.Types.Mixed,
		status_code: Number,
		response_time: Number,
		size: Number, // header size and body size in byte
	},

	data: Schema.Types.Mixed,
	token: {type: String, required: true, unique: true},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const RequestHistoryModel = model("RequestHistory", schema);
export default RequestHistoryModel;
