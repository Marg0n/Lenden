import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Root from "../layouts/Root";
import ErrorPage from "../pages/shared/ErrorPage";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import PrivateRoute from './PrivateRoute';
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LandingPage />,
                // loader: () => fetch(`${import.meta.env.VITE_SERVER}/allBlogs`),
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/registration",
                element: <Registration />,
            },            
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Profile />,
            },
        ],
    },
]);