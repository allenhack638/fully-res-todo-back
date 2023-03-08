import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import {middlewareLog,middlewareReg} from "./Middlewares/login_and_reg.js";
import post from "./controllers/Todos_post.js";
import get from "./controllers/Todos_get.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())


app.post("/login", middlewareLog);
app.post("/register", middlewareReg);
app.post("/todos",post);
app.get("/todos",get);



mongoose.set("strictQuery", false);
const url = process.env.CONNECTION_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to database successfully"))
.catch(console.error)


const PORT = process.env.PORT || 5000;
app.listen(PORT, (console.log("Port Successfully strated on port 5000")))