import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    first_name: {type: String, default: ""},
    last_name: {type: String, default: ""},

    oauth_provider: {type: String, enum: ['', 'google', 'github'], default: ''},
    oauth_id: {type: String, default: ''},
    remember_token: {type: String, default: ''},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const UserModel = mongoose.model("User", schema);
export default UserModel;
