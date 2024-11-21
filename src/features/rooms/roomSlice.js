import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getRooms = createAsyncThunk('room/fetchRooms', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/room/getRooms');
        return data;
    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            status: err.response?.status,
            details: err?.response?.data?.message,
        });
    }
});

export const addRooms = createAsyncThunk('room/addRooms', async ({ name, members }, { rejectWithValue }) => {
    try {
        const response = await api.post('/room/createRoom', { name, members });
        return response.data;
    } catch (err) {
        return rejectWithValue({
            message: err.message,
            code: err.code,
            status: err.response?.status,
            details: err?.response?.data?.message,
        });
    }
});

const roomsSlice = createSlice({
    name: 'room',
    initialState: { list: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRooms.fulfilled, (state, action) => {
                state.list = action.payload;
                state.status = 'idle';
            })
            .addCase(getRooms.rejected, (state, action) => {
                state.error = action.payload.details;
                state.status = 'error';
            })
            .addCase(addRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addRooms.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.status = 'idle';
            })
            .addCase(addRooms.rejected, (state, action) => {
                state.error = action.payload.details;
                state.status = 'error';
            });
    },
});

export default roomsSlice.reducer;
