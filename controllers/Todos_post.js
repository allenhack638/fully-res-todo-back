import dotenv from "dotenv"
import Cryptr from "cryptr"

import jwt from "jsonwebtoken"
import User from "../Models/User.js"
import Todos from "../Models/Todo.js"

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const post = async (req, res) => {

    const { token, todoItems } = req.body;

    if (token === null) {
        res.status(403);
        res.json({
            message: `Oops Session Expired`
        })
        return;
    }
    const verify = jwt.verify(token, SUPER_KEY, (err, data) => {
        if (err) {
            res.status(500).send("Please login again your last session has been expired");
            return;
        }
        return data;
    });
    const { email, pass } = verify;

    const users = await User.findOne({ email: email })

    const decryptedPass = cryptr.decrypt(users.password);
    if (!users || decryptedPass !== pass) {
        res.status(403);
        res.json({
            message: "Invalid Login",
        })
        return;
    }
    const todos = await Todos.findOne({ userId: users._id });
    if (!todos) {
        await Todos.create({
            userId: users._id,
            todos: todoItems
        });
    } else {
        todos.todos = todoItems;
        await todos.save();
    }
    res.json({
        message: "Success"
    });
}
export default post;