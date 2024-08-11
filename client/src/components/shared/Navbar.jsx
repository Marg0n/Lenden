
import { Link, NavLink } from 'react-router-dom';
import logo from '/লেনদেন.gif';
import { GiExitDoor } from "react-icons/gi";

const Navbar = () => {

    const lists = <>
        <li>
            <NavLink>Help</NavLink>
        </li>
        <li>
            <NavLink>About</NavLink>
        </li>
    </>

    return (
        <>
            <div className="navbar bg-base-100 shadow-2xl px-8">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {lists}
                        </ul>
                    </div>

                    {/* logo */}
                    <Link to='/'>
                        <img className="w-20 h-20 rounded-3xl " src={logo} alt="logo" />
                    </Link>

                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {lists}
                    </ul>
                </div>
                <Link to='/login' className="navbar-end">
                    <button className="btn">
                        Login <GiExitDoor />
                    </button>
                </Link>
            </div>
        </>
    );
};

export default Navbar;