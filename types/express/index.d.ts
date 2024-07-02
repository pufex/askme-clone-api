import type { ResponseUserType } from "../../db/users/model";

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: ResponseUserType
        }
    }
}