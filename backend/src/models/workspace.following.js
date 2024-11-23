import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    creator_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace"},
    name: String,
    content: String,

    viewing: {type: Number, default: 0},
    commenting: {type: Number, default: 0},
    editing: {type: Boolean, default: false},

    viewers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    commenters: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    editors: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const WorkspaceFollowing = mongoose.model("WorkspaceFollowing", schema);
export default WorkspaceFollowing;
