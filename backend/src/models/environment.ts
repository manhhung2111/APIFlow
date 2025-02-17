import {model, Schema} from "mongoose";
import {DEnvironment} from "@db-schemas";

const schema = new Schema<DEnvironment>({
    user_id: {type: String, required: true, index: true},
    workspace_id: {type: String, required: true, index: true},

    name: {type: String, required: true},

    scope: {type: Number, enum: [0, 1], default: 0, required: true},
    variables: [
        {
            selected: Boolean,
            variable: String,
            type: {type: String, enum: ["text", "password"], default: "text"},
            initial_value: String,
            current_value: String,
        },
    ],

    data: {type: Schema.Types.Mixed, default: {}},
    token: {type: String, required: true, unique: true},
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
        currentTime: () => Date.now(),
    },
});


const EnvironmentModel = model("Environment", schema);
export default EnvironmentModel;
