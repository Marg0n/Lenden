import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from './../hooks/useAuth';
import Loader from './../components/shared/Loader';

const PrivateRoute = ({children}) => {

    const {user, loading} = useAuth();
    const location = useLocation();
    // console.log(location)

    if (loading) {
        return <Loader/>;
    }

    if (!user) {
        return <Navigate to='/login' state={location?.pathname || '/'} replace={true}/>
    }

    return (
        <div>
            {children}
        </div>
    );  
};

PrivateRoute.propTypes = {
    children: PropTypes.node,
}

export default PrivateRoute;