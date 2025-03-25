import {model, Schema} from "mongoose";
import {DPasswordResetToken} from "@db-schemas";

const schema = new Schema<DPasswordResetToken>({
    user_id: {type: String, required: true, index: true},
    token: {type: String, required: true, unique: true},
    token_expiry: {type: Number, required: true},
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
        currentTime: () => Date.now(),
    },
    minimize: false,
});


const PasswordResetTokenModel = model("PasswordResetToken", schema);
export default PasswordResetTokenModel;
