import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


// ** Authentication Thunks (Async Operations) **//

/**
 * Defines an asynchronous thunk for user login.
 *
 * @param {Object} credentials - An object containing email and password for login.
 * @param {Object} thunkAPI - The Redux Thunk API object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<Object>} A promise that resolves with the logged-in user data or rejects with an error object.
 */

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await api.post(`auth/login`, { email, password });
        return response.data.user;
    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            status: err.response?.status,
            details: err.response?.data,
        });
    }
})

/**
 * Defines an asynchronous thunk for user signup.
 *
 * @param {Object} userInfo - An object containing email, password, and username for signup.
 * @param {Object} thunkAPI - The Redux Thunk API object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void>} A promise that resolves without a value upon successful signup, or rejects with an error object.
 */

export const signup = createAsyncThunk('auth/signup', async ({ email, password, username }, { rejectWithValue }) => {
    try {
        await api.post(`auth/signup`, { email, password, username });
    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            status: err.response?.status,
            details: err.response?.data,
        });
    }
});


/**
 * Defines an asynchronous thunk for user logout.
 *
 * @param {Object} thunkAPI - The Redux Thunk API object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void | Object>} A promise that resolves with null upon successful logout, or rejects with an error object.
 */

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await api.post('auth/logout', {})
        return null;

    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            details: err.response?.data,
        });
    }
});


const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: 'idle',
    error: null,
    authCheckLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // ** Pending State Updates (Triggered when async operations start) **/
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.authCheckLoading = true;
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
                state.authCheckLoading = true;
            })
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
            })

            // ** Fulfilled State Updates (Triggered when async operations succeeds) **/
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'idle';
                state.authCheckLoading = false;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.removeItem('user');
                state.user = null;
                state.status = 'idle';
                state.authCheckLoading = false;
            })
            .addCase(signup.fulfilled, (state) => {
                state.status = 'idle';
            })

            // ** Rejected State Updates (Triggered when async operations is rejected) **/
            .addCase(login.rejected, (state, action) => {
                state.status = 'error';
                state.user = null;
                state.error = action.payload;
                state.authCheckLoading = false;
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                localStorage.removeItem('user');
                state.user = null;
                state.status = 'error';
                state.error = action.payload;
                state.authCheckLoading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
    }
})


export default authSlice.reducer;