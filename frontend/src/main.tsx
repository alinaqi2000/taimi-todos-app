import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import Register from './pages/Register.tsx';

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
