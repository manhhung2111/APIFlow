import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

    name: {type: String, required: true},
    content: String,

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


const Workspace = mongoose.model("Workspace", schema);
export default Workspace;
