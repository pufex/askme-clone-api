import express from "express"
import {
    getUsers,
    getUser
} from "../controllers/UsersControllers"

const UsersRoutes = express.Router()

UsersRoutes.get("/", getUsers)
UsersRoutes.get("/:id", getUser)

export default UsersRoutes