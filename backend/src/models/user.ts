import {model, Schema} from "mongoose";
import {DUser} from "@db-schemas";

const schema = new Schema<DUser>({
	email: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	first_name: {type: String, default: ""},
	last_name: {type: String, default: ""},

	oauth_provider: {type: String, enum: ["", "google", "github"], default: ""},
	oauth_id: {type: String, default: ""},
	remember_token: {type: String, default: ""},

	data: Schema.Types.Mixed,
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const UserModel = model("User", schema);
export default UserModel;
