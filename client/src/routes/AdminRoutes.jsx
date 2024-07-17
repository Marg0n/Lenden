import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useUsersProfile from '../hooks/useUsersProfile';
import Loader from './../components/shared/Loader';
import useAuth from './../hooks/useAuth';

const AdminRoutes = ({ children }) => {

    const { user, loading } = useAuth();
    const [userData] = useUsersProfile();
    const location = useLocation();
    // console.log(location)

    if (loading) {
        return <Loader />;
    }

    if (!user && !userData[0]?.isAdmin) {
        return <Navigate to='/login' state={location?.pathname || '/'} replace={true} />
    }

    return (
        <div>
            {children}
        </div>
    );
};

AdminRoutes.propTypes = {
    children: PropTypes.node,
}

export default AdminRoutes;