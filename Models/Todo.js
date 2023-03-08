import mongoose from "mongoose";
const todosSchema = new mongoose.Schema({
    userId: String,
    todos: [{
        text: String
    }]
});
export default mongoose.model("Todos", todosSchema);