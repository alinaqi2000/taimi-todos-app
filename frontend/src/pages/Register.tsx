"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AuthLayout from "@/components/layout/AuthLayout"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "@/constants"
import { UserResponse } from "@/lib/responses"
import { User } from "@/store/models/User"
import useLocalStorage from 'react-use-localstorage';

const FormSchema = z.object({
    name: z.string().min(3, { message: "Name must be atleast 3 character." }),
    email: z.string().email({ message: "Please provide a valid email." }),
    password: z.string().min(6, { message: "Pasword must be atleast 6 character." }),
})

export default function Register() {
    const [localUser, setLocalUser] = useLocalStorage('user');
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await axios.post<UserResponse>(`${API_URL}users/register`, data)
            .then(res => res.data)
            .catch(res => res.response.data)

        if (response.error) {
            toast({ description: response.error, variant: "destructive" })
            return;
        }
        const user = new User(response.user?.id, response.user?.name, response.user?.email)
        setLocalUser(JSON.stringify(user))
    }

    return (
        <AuthLayout title="Create your account">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" size={"sm"}>Register</Button>
                </form>
                <h5 className="text-center text-sm mt-6">Already registered? <Button onClick={() => navigate("/login")} className="p-0" variant={"link"}>Login here</Button></h5>
                <Toaster />
            </Form>
        </AuthLayout>
    )
}
