// src/store/middleware/authMiddleware.js
import { logout } from '../../features/auth/authSlice';


const authMiddleware = (store) => (next) => async (action) => {

    const { dispatch } = store;

    if (action.payload?.status === 401) {
        dispatch(logout());
    };

    return next(action);
};

export default authMiddleware;
