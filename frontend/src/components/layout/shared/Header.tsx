import Logo from '@/components/brand/Logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { userStore } from '@/store/user.store';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'react-use-localstorage';

export default function Header() {
    const [localUser, setLocalUser] = useLocalStorage('user');
    const { user, setUser } = userStore();
    const navigate = useNavigate();

    return (
        <div className='mx-6 my-5 flex'>
            <Logo />
            <div className='ml-auto'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 border-2 border-purple-400">
                            <AvatarFallback className='font-semibold'>{user?.name[0] ?? "A"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem>
                            Setting
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            setLocalUser('')
                            navigate("/login")
                        }} className='text-red-600'>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}
