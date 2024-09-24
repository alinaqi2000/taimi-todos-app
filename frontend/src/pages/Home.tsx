import DefaultLayout from '@/components/layout/DefaultLayout';
import AddTodo from '@/components/todos/AddTodo';
import ListTodos from '@/components/todos/ListTodos';
import { userStore } from '@/store/user.store';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type MenuItem = "pending" | "completed"

export default function Home() {
    const { user } = userStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [menu, setMenu] = useState<MenuItem>("pending");

    useEffect(() => {
        const menuItem = searchParams.get("menuItem");
        if (menuItem === "pending" || menuItem === "completed")
            setMenu(menuItem);
    }, [])

    const changeMenu = (item: MenuItem) => {
        setMenu(item);
        setSearchParams({ menuItem: item });
    }

    return (
        <DefaultLayout>
            <div className='mx-2 pb-24'>
                <div className='flex justify-between items-baseline'>
                    <h4 className='mt-5 mb-10 font-semibold'>Welcome {user?.name} &#128075;</h4>
                    <AddTodo />
                </div>
                <ListTodos menu={menu} />
                <Menubar style={{
                    position: "fixed",
                    width: "calc(100vw - 40px)",
                    bottom: "20px",
                    left: "20px",
                    display: "flex",
                    justifyContent: "space-evenly"
                }} value={menu}>
                    <MenubarMenu value='pending'>
                        <MenubarTrigger onClick={() => changeMenu("pending")} style={{ cursor: "pointer", color: "rgb(253 186 116)", width: "48%", display: "flex", justifyContent: "center" }}>Pending</MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu value='completed'>
                        <MenubarTrigger onClick={() => changeMenu("completed")} style={{ cursor: "pointer", color: "rgb(134 239 172)", width: "48%", display: "flex", justifyContent: "center" }}>Completed</MenubarTrigger>
                    </MenubarMenu>
                </Menubar>
            </div>
        </DefaultLayout >
    )
}
