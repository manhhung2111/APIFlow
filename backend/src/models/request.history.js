import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},

    request: mongoose.Schema.Types.Mixed,
    response: {
        headers: mongoose.Schema.Types.Mixed,
        body: mongoose.Schema.Types.Mixed,
        status_code: Number,
        response_time: Number,
        size: Number,
    },

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const RequestHistory = mongoose.model("RequestHistory", schema);
export default RequestHistory;
