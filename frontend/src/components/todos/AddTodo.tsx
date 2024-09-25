
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { API_URL } from "@/constants"
import axios from "axios"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { FiPlus } from "react-icons/fi";
import { userStore } from "@/store/user.store"
import { TodoResponse } from "@/lib/responses"
import { todoStore } from "@/store/todo.store"
import { useState } from "react"
import ClipLoader from "react-spinners/ClipLoader";

const FormSchema = z.object({
    title: z.string().min(3, { message: "Title must be atleats 3 characters" })
})

export default function AddTodo() {
    const { user } = userStore();
    const { addTodo } = todoStore();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: ""
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);
        const response = await axios.post<TodoResponse>(`${API_URL}todos/create`, {
            title: data.title,
            completed: false,
            userId: user?.id
        })
            .then(res => res.data)
            .catch(err => err.response.data)
            .finally(() => setLoading(false))

        if (response.error) {
            toast({ description: response.error, variant: "destructive" })
            return;
        }

        addTodo(response.todo)
        form.setValue("title", "")
        setIsOpen(false);
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <Button onClick={() => setIsOpen(true)} size={"sm"}>Add Todo <FiPlus className='ml-1' size={16} /></Button>
            <DrawerContent className="px-6 pb-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DrawerHeader>
                            <DrawerTitle className="my-3">What are you planning to do?</DrawerTitle>
                        </DrawerHeader>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Some task..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading} className="w-full" size={"sm"}>{loading ? <ClipLoader className='mx-auto' size={12} /> : "Submit"}</Button>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>

    )
}
