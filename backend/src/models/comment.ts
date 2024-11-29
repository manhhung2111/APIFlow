import {model, Schema} from 'mongoose';
import {DComment} from "@db-schemas";

const schema = new Schema<DComment>({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    meta_type: {type: String, required: true},

    obj_key: {type: String, required: true, unique: true},
    obj_export: Schema.Types.Mixed,

    title: String,
    content: String,
    followers: [{type: Schema.Types.ObjectId, ref: "User"}],
    status: Number,

    data: Schema.Types.Mixed,
    token: {type: String, required: true, unique: true},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => Date.now()
    },
});


const CommentModel = model("Comment", schema);
export default CommentModel;
