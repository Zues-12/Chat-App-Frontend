import { configureStore } from "@reduxjs/toolkit";
import authMiddleware from "./middleware/authMiddleware";
import authReducer from '../features/auth/authSlice'
import messageReducer from '../features/messages/messageSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
        },
    }).concat(authMiddleware),
});

export default store;
