import { useState } from "react";
import { AiOutlineBars } from "react-icons/ai";
import { BsClipboard2DataFill } from 'react-icons/bs';
import { GrTask } from 'react-icons/gr';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdSpaceDashboard } from 'react-icons/md';
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import logo from '/লেনদেন.gif';


const DashboardNav = () => {




    const [isActive, setActive] = useState(false);

    // Sidebar Responsive Handler
    const handleBurgerToggle = () => {
        setActive(!isActive)
    }




    return (
        <>

            {/* Small Screen Navbar */}
            <div className=' flex justify-between md:hidden'>
                <div>
                    <div className='block cursor-pointer p-4 font-bold'>
                        {/* redirect to... */}
                        <Link to=''>
                            <img
                                className='w-auto h-7 rounded'
                                referrerPolicy='no-referrer' src={logo}
                                alt='logo'
                            // width='100'
                            // height='100'
                            />
                        </Link>
                    </div>
                </div>

                <button
                    onClick={handleBurgerToggle}
                    className='btn p-4 btn-ghost'
                >
                    <AiOutlineBars className='h-5 w-5' />
                </button>
            </div>


            <aside
                className={`z-10 md:fixed flex flex-col justify-between px-4 py-2 overflow-x-hidden overflow-y-auto bg-base-100 border-r rtl:border-r-0 rtl:border-l w-64 space-y-6 absolute inset-y-0 left-0 transform ${isActive && '-translate-x-full'
                    }  md:translate-x-0  transition duration-200 ease-in-out`}
            >

                <div className="mx-auto">
                    {/* logo */}
                    <div className=" mx-auto btn btn-ghost  animate__animated animate__heartBeat  animate__infinite">
                        {/* redirect to... */}
                        <Link to="" className='flex gap-2 items-center'>
                            <img className='w-auto h-7 rounded'
                                referrerPolicy='no-referrer' src={logo} alt='logo' />
                            <span className='font-bold'>{import.meta.env.VITE_WEBSITE}</span>
                        </Link>
                    </div>

                    {/* User Info */}
                    {/* <div className="flex flex-col items-center mt-6 -mx-2">

                        <div className='mb-4'>
                            <img
                                data-tooltip-id="name-tooltips"
                                data-tooltip-content={`${user?.displayName || user?.email}`}
                                referrerPolicy="no-referrer"
                                className="object-cover w-24 h-24 mx-2 rounded-full avatar ring ring-primary ring-offset-base-100 ring-offset-2 "
                                src={
                                    user?.photoURL ? user?.photoURL
                                        : "https://i.ibb.co/8dJbHdP/No-Photo-Available.webp"
                                }
                                alt="avatar" />
                            <Tooltip id="name-tooltips" />
                        </div>

                        <h4 className="mx-2 mt-2 font-semibold badge badge-info">
                            {user?.isAdmin ? "Admin" : "User"}
                        </h4>
                        <h4 className="mx-2 mt-2 font-semibold text-blue-500">
                            {user?.displayName}
                        </h4>
                        <p className="mx-2 mt-1 text-sm font-medium text-error">
                            {user?.email}
                        </p>
                    </div> */}


                </div>

                <div className="divider divider-accent my-2" ></div>

                {/* user option */}
                <div className="flex flex-col justify-between flex-1">
                    <nav>
                        <ul>
                            <li>
                                <NavLink
                                    to='/dashboard'
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform rounded-lg hover:bg-primary hover:text-base-300 ${isActive ? 'bg-primary text-base-300' : ''
                                        }`
                                    }
                                >
                                    <MdSpaceDashboard size={22} />

                                    <span className="mx-4 font-medium ">My profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='addTask'
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform rounded-lg hover:bg-primary hover:text-base-300 ${isActive ? 'bg-primary text-base-300' : ''
                                        }`
                                    }
                                >
                                    <GrTask size={22} />

                                    <span className="mx-4 font-medium">Add Tasks</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='upcomingTasks'
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform rounded-lg hover:bg-primary hover:text-base-300 ${isActive ? 'bg-primary text-base-300' : ''
                                        }`
                                    }
                                >
                                    <BsClipboard2DataFill size={22} />

                                    <span className="mx-4 font-medium">Upcoming Tasks</span>
                                </NavLink>
                            </li>

                        </ul>
                    </nav>
                </div>

                <div className="divider divider-accent my-2" ></div>

                {/* logout */}
                <button
                    onClick={loggedOut}
                    className="flex items-center justify-between  px-4 py-2 transition-colors duration-300 transform rounded-lg  hover:bg-primary hover:text-base-300">
                    <div
                        className="flex items-center gap-x-2 ">
                        <img
                            referrerPolicy='no-referrer'
                            className="object-cover rounded-full h-7 w-7 avatar ring ring-secondary ring-offset-base-100 ring-offset-2 "
                            src={
                                user?.photoURL ? user?.photoURL
                                    : "https://i.ibb.co/8dJbHdP/No-Photo-Available.webp"
                            }
                            alt="avatar"
                        />
                        <span className="text-sm font-medium ml-2">{user?.displayName}</span>
                    </div>
                    <IoLogOutOutline size={25} />
                </button>
            </aside>
        </>
    )
}

export default DashboardNav