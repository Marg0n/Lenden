import { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";
import Loader from "../../components/shared/Loader";



const ErrorPage = () => {

    const error = useRouteError();
    // console.error(error);



    // loader
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

   
    return (
        <>
            {
                loading ? <Loader />
                    :
                    <div className="flex flex-col gap-6 min-h-screen justify-center items-center bg-base-100">
                        <img
                            src="https://www.svgrepo.com/show/492797/woman-sighing.svg"
                            alt=""
                            className="h-48 object-cover"
                        />
                        <h1 className='text-error text-xl lg:text-3xl font-bold'>Oops!</h1>
                        <p className='text-error text-xl lg:text-3xl font-semibold'>Sorry, an unexpected error has occurred!</p>
                        <p className='text-error text-xl lg:text-3xl font-semibold'>
                            <i>{error.status || "Error"}</i> :  <i>{error.statusText || error.message}</i>
                        </p>
                        <div className="flex gap-4 justify-center items-center">
                            <Link
                                to='/'
                                className="relative inline-block px-4 py-2 font-medium group">
                                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                <span className="absolute inset-0 w-full h-full bg-white border-2 border-secondary group-hover:bg-primary"></span>
                                <span className="relative text-black group-hover:text-error">
                                    Go To Home
                                </span>
                            </Link>
                            {/* {
                                user && <Link
                                    to='/dashboard'
                                    className="relative inline-block px-4 py-2 font-medium group">
                                    <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-primary group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                    <span className="absolute inset-0 w-full h-full bg-white border-2 border-secondary group-hover:bg-primary"></span>
                                    <span className="relative text-black group-hover:text-error">
                                        Go To Dashboard
                                    </span>
                                </Link>
                            } */}

                        </div>
                    </div>
            }
        </>
    );
};

export default ErrorPage;