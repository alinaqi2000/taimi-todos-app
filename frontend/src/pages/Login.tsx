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
import { Toaster } from "@/components/ui/toaster"
import AuthLayout from "@/components/layout/AuthLayout"
import { useNavigate } from "react-router-dom"
import { User } from "@/store/models/User"
import { UserResponse } from "@/lib/responses"
import { API_URL } from "@/constants"
import axios from "axios"
import useLocalStorage from 'react-use-localstorage';
import { useState } from "react"
import ClipLoader from "react-spinners/ClipLoader";

const FormSchema = z.object({
    email: z.string().email({ message: "Please provide a valid email." }),
    password: z.string().min(6, { message: "Pasword must be atleast 6 character." }),
})

export default function Login() {
    const [localUser, setLocalUser] = useLocalStorage('user');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);
        const response = await axios.post<UserResponse>(`${API_URL}users/login`, data)
            .then(res => res.data)
            .catch(res => res.response.data)
            .finally(() => setLoading(false));

        if (response.error) {
            toast({ description: response.error, variant: "destructive" })
            return;
        }
        const user = new User(response.user?.id, response.user?.name, response.user?.email)
        setLocalUser(JSON.stringify(user))
    }

    return (
        <AuthLayout title="Please login to continue">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Button type="submit" disabled={loading} className="w-full" size={"sm"}>{loading ? <ClipLoader className='mx-auto' size={12} /> : "Login"}</Button>
                </form>
                <h5 className="text-center text-sm mt-6">New to our app? <Button onClick={() => navigate("/register")} className="p-0" variant={"link"}>Register here</Button></h5>
                <Toaster />
            </Form>
        </AuthLayout>
    )
}
