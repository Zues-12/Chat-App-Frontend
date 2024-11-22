// src/store/middleware/authMiddleware.js
import { logout } from '../../features/auth/authSlice';


/** Store middleware to check if the payload of the req has a 401 error to log the user out */
const authMiddleware = (store) => (next) => async (action) => {
    const { dispatch } = store;
    if (action.payload?.status === 401) {
        dispatch(logout());
    };
    return next(action);
};

export default authMiddleware;
