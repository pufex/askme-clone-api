import type {Request, Response, NextFunction} from 'express'
import type { ResponseUserType } from '../db/users/model'
import jwt from "jsonwebtoken"
import User from '../db/users/model'

const verifyJWT = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.sendStatus(403)

    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        {},
        async (err, decoded) => {
            if(err){
                return res.sendStatus(403);
            }
            const {name} = decoded as ResponseUserType;
            const userQuery =  {name}
            const user = await User.findOne(userQuery)
                .lean()
                .exec()

            if(!user){
                return res.sendStatus(403)
            }

            req.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            } 
            next()
        }
    )
}

export default verifyJWT