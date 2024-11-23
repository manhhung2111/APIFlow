import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    workspace_id: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace"},

    name: {type: String, required: true},

    scope: {type: Number, enum: [0, 1], default: 0, required: true},
    variables: [
        {
            variable: String,
            type: {type: String, enum: ["text", "password"], default: "text"},
            initial_value: String,
            current_value: String
        },
    ],

    data: mongoose.Schema.Types.Mixed,
    token: {type: String, required: true},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const Environment = mongoose.model("Environment", schema);
export default Environment;
