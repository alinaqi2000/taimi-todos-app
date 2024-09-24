import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Todo } from '@/store/models/Todo';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { TodoResponse } from '@/lib/responses';
import { API_URL } from '@/constants';
import { toast } from "@/hooks/use-toast"
import { todoStore } from '@/store/todo.store';
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";

export default function TodoItem({ todo, index, fetchTodos }: { index: number, todo: Todo, fetchTodos: () => void }) {
    const [toggleLoading, setToggleLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { updateTodo, removeTodo } = todoStore();

    const toggleCompleted = async () => {
        setToggleLoading(true);
        const response = await axios.put<TodoResponse>(`${API_URL}todos/update/` + todo.id, {
            title: todo.title,
            completed: !todo.completed,
            userId: todo.userId
        })
            .then(res => res.data)
            .catch(res => res.response.data)

        if (response.error) {
            toast({ description: response.error, variant: "destructive" })
            return;
        }

        updateTodo(index, response.todo)
        setToggleLoading(false);
        fetchTodos();
    }
    const deleteTodo = async () => {
        setDeleteLoading(true);
        const response = await axios.delete(`${API_URL}todos/delete/` + todo.id)
            .then(res => res.data)
            .catch(res => res.response.data)

        if (response.error) {
            toast({ description: response.error, variant: "destructive", duration: 3000 })
            return;
        }

        setDeleteLoading(false);
        toast({ description: response.message, variant: "default", duration: 3000 })
        removeTodo(todo.id)
    }
    return (
        <>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarFallback>{todo.title[0] ?? "T"}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{todo.title}</p>
                </div>
                <div className="ml-auto font-medium flex items-center gap-2">
                    <Button onClick={deleteTodo} size={"icon"} variant={"ghost"} className='text-red-600'>
                        {deleteLoading ? <ClipLoader className='mx-auto' color='#fff' size={12} /> : <FiTrash />}
                    </Button>
                    {
                        todo.completed ?
                            <Badge onClick={toggleCompleted} className={`bg-green-300 cursor-pointer flex justify-center py-1 min-w-20 min-h-6`}>{toggleLoading ? <ClipLoader className='mx-auto' size={12} /> : todo.completed ? "Completed" : "Pending"}</Badge>
                            : <Badge onClick={toggleCompleted} className={`bg-orange-300 cursor-pointer flex justify-center py-1 min-w-20 min-h-6`}>{toggleLoading ? <ClipLoader className='mx-auto' size={12} /> : todo.completed ? "Completed" : "Pending"}</Badge>
                    }
                </div>
            </div>
            <Separator />
        </>
    )
}
export function TodoItemSkeleton() {
    return (
        <>
            <div className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                    <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="ml-auto font-medium">
                    <Skeleton className="h-5 w-[80px]" />
                </div>
            </div>
            <Separator />
        </>
    )
}