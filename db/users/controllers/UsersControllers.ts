import type {Request, Response} from "express"
import type { ResponseUserType } from "../model"
import User from "../model"
import mongoose from "mongoose"

export const getUsers = async (
    req: Request,
    res: Response 
) => {
    const users = await User.find()
        .lean()
        .exec()
    if(!users.length){
        return res.status(404).json([])
    }

    // @ts-ignore
    const usersArr: ResponseUserType = users.map((user) => {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }
    })
    res.json(usersArr)
}

export const getUser = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid or missing user ID."})

    const user = await User.findById(id)
        .lean()
        .exec()
    if(!user){
        return res.status(404).json({message: 'User not found.'})
    }

    const responseUser: ResponseUserType = {
        id: user._id.toString(),
        name: user.name,
        email: user.email
    }
    res.json(responseUser)
}