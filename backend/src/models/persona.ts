import {model, Schema} from "mongoose";
import {DPersona} from "@db-schemas";

const schema = new Schema<DPersona>({
    user_id: {type: String, required: true, index: true},
    workspace_id: {type: String, required: true, index: true},

    name: {type: String, required: true},
    authorization: {
        type: {type: Number, enum: [2, 3, 4, 5], default: 2},
        data: {type: Schema.Types.Mixed, default: {}},
    },

    data: {type: Schema.Types.Mixed, default: {}},
    token: {type: String, required: true, unique: true},
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
        currentTime: () => Date.now(),
    },
    minimize: false,
});


const PersonaModel = model("Persona", schema);
export default PersonaModel;
