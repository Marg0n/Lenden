import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Root from "../layouts/Root";
import ErrorPage from "../pages/shared/ErrorPage";





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
        ],
    },
    
]);