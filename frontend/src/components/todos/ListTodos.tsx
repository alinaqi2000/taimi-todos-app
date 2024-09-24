import { todoStore } from '@/store/todo.store';
import TodoItem, { TodoItemSkeleton } from './TodoItem';
import { Todo } from '@/store/models/Todo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import { userStore } from '@/store/user.store';
import { TodosResponse } from '@/lib/responses';
import EmptyImage from '../../assets/empty.svg';
import { MenuItem } from '@/pages/Home';

export default function ListTodos({ menu }: { menu: MenuItem }) {
    const { user } = userStore();
    const [loading, setLoading] = useState(false);
    const { todos, setTodos } = todoStore();


    useEffect(() => {
        setLoading(true)
        fetchTodos()
    }, [user]);

    const fetchTodos = async () => {
        const response = await axios.get<TodosResponse>(API_URL + "todos/all/" + user?.id).then(res => res.data)
        setTodos(response.todos)
        setLoading(false)
    }

    const loadTodos = () => {
        let filteredTodos: Todo[] = [];
        switch (menu) {
            case "completed":
                filteredTodos = todos.filter(t => t.completed);
                break;
            case "pending":
                filteredTodos = todos.filter(t => !t.completed);
                break;
            default:
                break;
        }
        if (filteredTodos.length === 0) {
            return (
                <div className="space-y-3 pt-32 flex flex-col gap-12 items-center">
                    <img src={EmptyImage} style={{ maxWidth: "50vw", maxHeight: "25vh" }} />
                    <h3>{menu === "completed" ? "All tasks are done!" : "No task pending"}</h3>
                </div>
            )
        }

        return (
            <div className="space-y-3">
                {filteredTodos.map((todo: Todo, index: number) => <TodoItem fetchTodos={fetchTodos} todo={todo} index={index} key={todo.id} />)}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((n: number) => <TodoItemSkeleton key={`${n}`} />)}
            </div>
        )
    }

    return loadTodos();
}
