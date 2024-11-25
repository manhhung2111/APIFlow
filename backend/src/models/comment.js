import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    metatype: String,

    obj_key: String,
    obj_export: mongoose.Schema.Types.Mixed,

    title: String,
    content: String,
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    status: Number,

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const Comment = mongoose.model("Comment", schema);
export default Comment;
