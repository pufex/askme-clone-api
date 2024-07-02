import type { ResponseUserType } from "../users/model"
import mongoose from "mongoose"

export type QuestionType = {
    content: string,
    recipient: mongoose.Schema.Types.ObjectId,
    isAnswered: boolean,
    answer: string | null,
    createdAt: Date,
}

export type QuestionInBodyType = {
    content: string,
    recipient: string,
}

export type ResponseQuestionType = {
    id: string,
    content: string,
    recipient: ResponseUserType,
    isAnswered: boolean,
    answer: string | null,
    createdAt: Date
}

const QuestionSchema = new mongoose.Schema<QuestionType>(
    {
        content: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        recipient: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        isAnswered: {
            type: Boolean,
            default: false
        },
        answer: {
            type: String,
            default: null,
            min: 1,
            max: 300,
        }
    },
    {
        timestamps: {createdAt: true}
    }
)

const QuestionModel = mongoose.model("Question", QuestionSchema)

export default QuestionModel