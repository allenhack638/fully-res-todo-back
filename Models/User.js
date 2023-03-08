import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});
export default mongoose.model("User", userSchema);