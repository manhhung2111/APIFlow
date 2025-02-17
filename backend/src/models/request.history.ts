import {model, Schema} from "mongoose";
import {DRequestHistory} from "@db-schemas";

const schema = new Schema<DRequestHistory>({
	user_id: {type: String, required: true, index: true},
	workspace_id: {type: String, required: true, index: true},

	request: {type: Schema.Types.Mixed, default: {}},
	response: {
		headers: {type: Schema.Types.Mixed, default: []},
		body: {type: Schema.Types.Mixed, default: {}},
		status_code: Number,
		response_time: Number,
		size: Number, // header size and body size in byte
	},

	data: {type: Schema.Types.Mixed, default: {}},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const RequestHistoryModel = model("RequestHistory", schema);
export default RequestHistoryModel;
