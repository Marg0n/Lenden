import { Outlet } from "react-router-dom";
import Footer from './../components/shared/Footer';
import Navbar from "../components/shared/Navbar";



const Root = () => {
    return (
        <div className="font-lato font-serif">
            {/* navbar */}
            <Navbar/>

            <div className="container mx-2 md:mx-auto my-6 min-h-[calc(100vh-304px)] ">
                <Outlet />
            </div>

            {/* footer */}
            <Footer/>
        </div>
    );
};

export default Root;