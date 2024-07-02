import type {Request, Response} from "express"
import { 
    LoginUserType, 
    RegisterUserType, 
    ResponseUserType 
} from "../model"
import User from "../model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (
    req: Request,
    res: Response
) => {
    const {name, password} = req.body as RegisterUserType 

    if(!name || !password)
        return res.status(400).json({message: "Missing credentials."})

    const existingQuery = {name};
    const existingUser = await User.findOne(existingQuery)
        .lean()
        .exec()
    if(existingUser){
        return res.status(409).json({message: "Username taken."})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({name, password: hashedPassword})
    res.status(201).json({message: `User ${name} successfully created!`})
}

export const login = async (
    req: Request,
    res: Response
) => {
    const {name, password} = req.body as LoginUserType
    if(!name || !password){
        return res.status(400).json({message: "Missing credentials."})
    }

    const userQuery = {name}
    const user = await User.findOne(userQuery)
        .lean()
        .exec()
    if(!user){
        return res.sendStatus(401)
    }

    const hashedPassword = user.password
    const match = await bcrypt.compare(password, hashedPassword)
    if(!match){
        return res.sendStatus(401)
    }

    const payload: ResponseUserType = {
        id: user._id.toString(),
        name: user.name,
        email: user.email
    }

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn: "30d"}
    )
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: "15m"}
    )

    res.cookie("token", refreshToken, {httpOnly: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 30, secure: true })
    res.json({user: payload, accessToken})
}

export const refresh = (
    req: Request,
    res: Response
) => {
    const token = req.cookies.token
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
        {},
        async (err, decoded) => {
            if(err){
                return res.status(403).json({message: "Invalid token."})
            }

            const {name} = decoded as ResponseUserType
            const userQuery = {name}
            const user = await User.findOne(userQuery)
                .lean()
                .exec()
            if(!user){
                return res.sendStatus(403)
            }

            const payload: ResponseUserType = {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "15m"}
            )

            res.json({user: payload, accessToken})
        }
    )
}

export const logout = (
    req: Request,
    res: Response
) => {
    const token = req.cookies.token
    if(!token){
        return res.sendStatus(204)
    }
    res.clearCookie("token", {httpOnly: true, sameSite: "none", secure: true})
    res.sendStatus(200)
}
