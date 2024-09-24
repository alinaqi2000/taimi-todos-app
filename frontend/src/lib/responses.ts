import { Todo } from "@/store/models/Todo"
import { User } from "@/store/models/User"

export interface UserResponse {
    user?: User
    error?: string
}
export interface TodosResponse {
    todos: Todo[]
}
export interface TodoResponse {
    todo?: Todo
    error?: string
}
export interface TodoDeleteResponse {
    message?: string
    error?: string
}  