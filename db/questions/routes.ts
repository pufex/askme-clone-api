import express from "express"

import { 
    newQuestion,
    deleteQuestion,
    getAnsweredUsersQuestions,
    getAllUsersQuestions,
    answerQuestion,
    editAnswer
} from "./controllers"
import verifyJWT from "../../middleware/verifyJWT"

const QuestionsRoutes = express.Router()

QuestionsRoutes.post("/new", newQuestion)
QuestionsRoutes.delete("/:id", verifyJWT, deleteQuestion)
QuestionsRoutes.get("/answered/:id", getAnsweredUsersQuestions)
QuestionsRoutes.get("/all/:id", verifyJWT, getAllUsersQuestions)
QuestionsRoutes.post("/answer/:id", verifyJWT, answerQuestion)
QuestionsRoutes.patch("/edit/:id", verifyJWT, editAnswer)

export default QuestionsRoutes