import {model, Schema} from 'mongoose';
import {DWorkspace} from "@db-schemas";

const schema = new Schema<DWorkspace>({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},

    name: {type: String, required: true},
    content: String,

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


const WorkspaceModel = model("Workspace", schema);
export default WorkspaceModel;
