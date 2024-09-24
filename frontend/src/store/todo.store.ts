import { create } from 'zustand'
import { Todo } from './models/Todo'

export const todoStore = create<{
    todos: Todo[],
    setTodos: (todos: Todo[]) => void,
    addTodo: (todo: Todo) => void,
    updateTodo: (index: number, todo: Todo) => void,
    removeTodo: (id: string) => void,
}>((set) => ({
    todos: [],
    setTodos: (todos: Todo[]) => set({ todos }),
    addTodo: (todo: Todo) => set((state) => ({ todos: [...state.todos, todo] })),
    updateTodo: (index: number, todo: Todo) => set((state) => {
        const currentTodos = state.todos
        currentTodos[index] = todo;
        return { todos: currentTodos }
    }),
    removeTodo: (id: string) => set(state => ({ todos: [...state.todos.filter(todo => todo.id !== id)] }))
}))
