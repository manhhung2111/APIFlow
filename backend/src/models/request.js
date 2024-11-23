import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
    collection_id: {type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true},
    folder_id: {type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null},

    name: {type: String, required: true},
    content: String,

    method: {type: String, required: true, enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], default: "GET"},
    url: {type: String, required: true},

    params: [{key: String, value: String, description: String}],
    headers: [{key: String, value: String, description: String}],
    authorization: {
        authorization_type: {type: Number, enum: [0, 1, 2, 3, 4], default: 0},
        authorization_data: mongoose.Schema.Types.Mixed,
    },
    body: {
        body_type: {type: Number, enum: [0, 1, 2, 3], default: 0},
        body_data: mongoose.Schema.Types.Mixed,
    },
    scripts: {
        pre_script: {type: String, default: ""},
        post_script: {type: String, default: ""},
    },

    tag: {type: Number, enum: [0, 1, 2], default: 0},

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const Request = mongoose.model("Request", schema);
export default Request;
