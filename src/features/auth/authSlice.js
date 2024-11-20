import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


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

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await api.post('auth/logout', {})
        return null;

    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            // status: err.response?.status,
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

            //pending wale
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

            // fulfilled wale
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

            // rejected wale
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