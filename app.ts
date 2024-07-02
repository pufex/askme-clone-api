import {config} from "dotenv"
config()

import express from "express"
import mongoose from "mongoose"

import corsOptions from "./config/cors/corsOptions"

import cookieParser from "cookie-parser"
import cors from "cors"

import DomainRoutes from "./domain/routes/routes"
import AuthRouter from "./db/users/routes/AuthRoutes"
import UsersRoutes from "./db/users/routes/UsersRoutes"
import QuestionsRoutes from "./db/questions/routes"

import CatchAll from "./domain/catchAll"

const app = express()

app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/", DomainRoutes)
app.use("/auth", AuthRouter)
app.use("/questions", QuestionsRoutes)
app.use("/users", UsersRoutes)

app.use("*", CatchAll)

const uri = process.env.MONGODB_KEY as string;
mongoose.connect(uri)
    .then(() => {
        console.log("Connected to DB!")
        const port = process.env.PORT || 9000
        app.listen(port, () => console.log(`Listening to port ${port}!`))
    })
    .catch((err) => {
        console.log("Failed to connect to DB.")
        console.log(err)
        process.exit(1)
    })
