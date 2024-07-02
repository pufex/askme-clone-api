import type {Request, Response} from "express"
import express from "express"
import path from "path"

const DomainRoutes = express.Router();

DomainRoutes.get("^/$|/index(.html)?", (
    req: Request,
    res: Response
) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

export default DomainRoutes