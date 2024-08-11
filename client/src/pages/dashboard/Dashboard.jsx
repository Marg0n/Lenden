import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/shared/Loader";
import DashboardNav from './../../components/shared/DashboardNav';



const Dashboard = () => {

    const { loading } = useAuth()

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="font-lato md:flex min-h-screen w-full">
            {/* navbar */}
            <div className=" ">
                <DashboardNav />
            </div>

            <div className="flex-1 md:ml-64 my-6 ">
                <Outlet />
            </div>

        </div>
    );
};

export default Dashboard;