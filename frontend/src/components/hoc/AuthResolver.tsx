import { userStore } from "@/store/user.store";
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from 'react-use-localstorage';

export default function AuthResolver(props: { children: JSX.Element | JSX.Element[] }) {
    const [localUser] = useLocalStorage('user');
    const { user, setUser } = userStore();
    const location = useLocation();
    const navigate = useNavigate();
    const PUBLIC_ROUTES = [
        '/register',
        '/login',
    ]
    const applyResolver = () => {
        const currentPath = location.pathname;
        setUser(localUser ? JSON.parse(localUser) : null)
        if (localUser) {
            if (PUBLIC_ROUTES.findIndex(path => path === currentPath) !== -1) {
                navigate("/");
            }
        } else {
            if (PUBLIC_ROUTES.findIndex(path => path === currentPath) === -1) {
                navigate("/login");
            }
        }
    }


    useEffect(applyResolver, [location.pathname, localUser]);

    return (
        <>{props.children}</>
    )
}
