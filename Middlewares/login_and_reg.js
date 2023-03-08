import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import User from "../Models/User.js"
import dotenv from "dotenv"

dotenv.config();
const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

export async function middlewareLog(req, res, next) {

    const state = req.body.body;

    const token = jwt.sign(state, SUPER_KEY, { expiresIn: '2h' });

    const { email, pass } = state;

    const users = await User.findOne({ email: email });
    if (!users || cryptr.decrypt(users.password) !== pass) {
        res.status(403).send({
            message: "Invalid Login"
        })
        return;
    }
    res.json({
        token: token,
        name: users.name
    })
    next();
}

export async function middlewareReg(req, res, next) {

    const { email, pass, name } = req.body;
    const encryptedPass = cryptr.encrypt(pass);
    const users = await User.findOne({ email: email });
    if (users) {
        res.status(500);
        res.json({
            message: "user already exsists",
        })
        return;
    }
    const user = new User({ email: email, password: encryptedPass, name: name });
    await user.save();
    res.json({
        message: "Registration Success",
    });
    next();
}