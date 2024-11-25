import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},

    name: {type: String, required: true},
    content: String,

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const Collection = mongoose.model("Collection", schema);
export default Collection;
