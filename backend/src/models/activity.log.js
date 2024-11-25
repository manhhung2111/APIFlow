import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    meta_type: String,

    name: String,
    action: String,
    tag: String,
    
    obj_key: String,
    obj_type: String,
    obj_export: mongoose.Schema.Types.Mixed,

    data: mongoose.Schema.Types.Mixed,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const ActivityLog = mongoose.model("ActivityLog", schema);
export default ActivityLog;
