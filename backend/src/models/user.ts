import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    first_name: {type: String, default: ""},
    last_name: {type: String, default: ""},

    oauth_provider: {type: String, enum: ['', 'google', 'github'], default: ''},
    oauth_id: {type: String},
    remember_token: {type: String},
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


const User = mongoose.model("User", schema);
export default User;
