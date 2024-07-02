import type {Request, Response} from "express" 
import path from "path"

const NotFound = (
    req: Request,
    res: Response
) => {
    if(req.accepts("html")){
        res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
    }else if(req.accepts("json")){
        res.status(404).json({message: "Not Found"})
    }else res.status(404).type("text").send("Not found")
}

export default NotFound