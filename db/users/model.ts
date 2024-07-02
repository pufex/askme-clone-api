import mongoose from "mongoose"

export type UserType = {
    name: string,
    password: string,
    email: string | null,
}

export type RegisterUserType = Pick<UserType, "name" | "password"> 
export type LoginUserType = RegisterUserType
export type ResponseUserType = Omit<UserType, "password"> & {id: string}

const UserSchema = new mongoose.Schema<UserType>({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (val: string) => {
                const USERNAME_REGEX = /^[A-z0-9-_]{6,25}$/
                return USERNAME_REGEX.test(val)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: null,
    }
})

const UserModel = mongoose.model("User", UserSchema)

export default UserModel