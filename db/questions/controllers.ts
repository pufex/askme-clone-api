import type {Request, Response} from "express"
import type { QuestionInBodyType, ResponseQuestionType } from "./model"
import mongoose from "mongoose"
import Question from "./model"
import User from "../users/model"

export const newQuestion = async (
    req: Request,
    res: Response
) => {
    const {content, recipient} = req.body as QuestionInBodyType
    if(!content || !recipient)
        return res.status(400).json({message: "Missing required fields."})
    
    if(!mongoose.Types.ObjectId.isValid(recipient)){
        return res.status(400).json({message: "Recipient's ID is invalid"})
    }

    const recipientId = new mongoose.Types.ObjectId(recipient)
    const foundRecipientQuery = {_id: recipientId}
    const foundRecipient = await User.findOne(foundRecipientQuery)
    if(!foundRecipient){
        return res.status(409).json({message: "Recipient doesn't exist."})
    }

    await Question.create({content, recipient: recipientId})
    res.json({message: "Question successfully created!"})
}

export const deleteQuestion = async (
    req: Request,
    res: Response,
) => {
    const {user} = req;
    if(!user)
        return res.sendStatus(401)
    
    const id = req.params.id;
    const questionId = new mongoose.Types.ObjectId(id);
    const questionQuery = {_id: questionId}
    const question = await Question.findOne(questionQuery)
        .exec()
    if(!question)
        return res.sendStatus(404)

    if(question.recipient.toString() !== user.id)
        return res.sendStatus(403)
    
    await question.deleteOne().exec()
    res.json({message: `Question deleted.`})
}

export const getAnsweredUsersQuestions = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Missing or invalid user ID."})
    
    const userId = new mongoose.Types.ObjectId(id);
    const userQuery = {_id: userId}
    const user = await User.findOne(userQuery)
        .lean()
        .exec()
    if(!user)
        return res.status(409).json({message: "User doesn't exist."})

    const questionsQuery = {
        recipient: userId,
        isAnswered: true
    }
    const questions = await Question.find(questionsQuery)
        .lean()
        .exec()
    if(!questions.length)
        return res.status(404).json([])
   
    const questionsArr: ResponseQuestionType[] = questions.map((question) => {
        return {
            id: question._id.toString(),
            content: question.content,
            recipient: {
                id,
                email: user.email,
                name: user.name
            },
            isAnswered: question.isAnswered,
            answer: question.answer,
            createdAt: question.createdAt
        }
    })
    res.json(questionsArr)
}

export const getAllUsersQuestions = async (
    req: Request,
    res: Response
) => {

    const {user} = req
    if(!user)
        return res.sendStatus(401);

    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Missing or invalid user ID."})

    if(user.id !== id)
        return res.sendStatus(403)    

    const recipientId = new mongoose.Types.ObjectId(id);
    const recipientQuery = {_id: recipientId}
    const recipient = await User.findOne(recipientQuery)
        .lean()
        .exec()
    if(!recipient)
        return res.status(409).json({message: "User doesnt't exist"})

    const questionsQuery = {recipient: recipientId};
    const questions = await Question.find(questionsQuery)
        .lean()
        .exec()
    if(!questions.length)
        return res.status(404).json([])

    const questionsArr: ResponseQuestionType[] = questions.map((question) => {
        return {
            id: question._id.toString(),
            content: question.content,
            recipient: {
                id: recipient._id.toString(),
                name: recipient.name,
                email: recipient.email,
            },
            isAnswered: question.isAnswered,
            answer: question.answer,
            createdAt: question.createdAt
        }
    })
    res.json(questionsArr)
    
}

export const answerQuestion = async (
    req: Request,
    res: Response
) => {
    const {user} = req
    if(!user)
        return res.sendStatus(401)
    
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid or missing question ID."})

    const {answer} = req.body as {answer: string}
    if(!answer)
        return res.status(400).json({message: "Missing required fields."})

    const question = await Question.findById(id).exec()
    if(!question)
        return res.status(404).json({error: "Question couldn't be found."})

    if(question.recipient.toString() !== user.id)
        return res.sendStatus(403)


    question.answer = answer
    question.isAnswered = true
    await question.save();
    res.json({message: "Question has been answered successfully."})
}

export const editAnswer = async (
    req: Request,
    res: Response
) => {
    const {user} = req;
    if(!user){
        return res.sendStatus(401)
    }

    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid or missing question's ID."})
    }

    const {answer} = req.body as Partial<{answer: string}>
    if(!answer){
        return res.status(400).json({message: "Missing required fields."})
    }

    const question = await Question.findById(id);
    if(!question){
        return res.sendStatus(404)
    }

    if(question.recipient.toString() !== user.id){
        return res.sendStatus(403);
    }

    
    question.isAnswered = true;
    question.answer = answer;

    await question.save();
    res.json({message: "Answer updated successfully!"})
}