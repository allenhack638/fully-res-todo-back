import dotenv from "dotenv"
import Cryptr from "cryptr"

import jwt from "jsonwebtoken"
import User from "../Models/User.js"
import Todos from "../Models/Todo.js"

dotenv.config();
const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const get = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
        res.status(403);
        res.json({
            message: `Oops Session Expired Login Again`
        })
        return;
    }
    const verify = jwt.verify(token, SUPER_KEY, (err, data) => {
        if (err) {
            res.status(408).json("Oops Session Expired");
            return;
        }
        return data;
    });

    const { email, pass } = verify;
    const users = await User.findOne({ email: email });

    if (!users) {
        res.status(403);
        res.json({
            message: "Auth Failed",
        })
        return;
    }
    const decryptedPass = cryptr.decrypt(users.password);
    if (decryptedPass !== pass) {
        res.status(403);
        res.json({
            message: "Auth Failed",
        })
        return;
    }
    const available = await Todos.findOne({ userId: users._id });
    if (available !== null) {
        const { todos } = await Todos.findOne({ userId: users._id });
        res.json(todos);
    } else
        return;
}
export default get