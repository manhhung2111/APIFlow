import {model, Schema} from "mongoose";
import {DDraftUser, DUser} from "@db-schemas";

const schema = new Schema<DDraftUser>({
	email: {type: String, unique: true, required: true},
	password: {type: String, default: ""},

	is_verified: {type: Boolean, default: false},
	verification_token: {type: String, default: ""},
	verification_token_expiry: {type: Number, default: 0},

	data: {type: Schema.Types.Mixed, default: {}},
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		currentTime: () => Date.now(),
	},
});


const DraftUserModel = model("DraftUser", schema);
export default DraftUserModel;
