import {model, Schema} from 'mongoose';
import {DWorkspaceFollowing} from "@db-schemas";

const schema = new Schema<DWorkspaceFollowing>({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    creator_id: {type: Schema.Types.ObjectId, ref: "User", required: true},

    workspace_id: {type: Schema.Types.ObjectId, ref: "Workspace"},
    name: {type: String, required: true},
    content: String,

    viewing: {type: Number, default: 0},
    commenting: {type: Number, default: 0},
    editing: {type: Number, default: 0},

    viewers: [{type: Schema.Types.ObjectId, ref: "User"}],
    commenters: [{type: Schema.Types.ObjectId, ref: "User"}],
    editors: [{type: Schema.Types.ObjectId, ref: "User"}],

    data: Schema.Types.Mixed,
    token: {type: String, required: true, unique: true},
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => Date.now()
    },
});


const WorkspaceFollowingModel = model("WorkspaceFollowing", schema);
export default WorkspaceFollowingModel;
