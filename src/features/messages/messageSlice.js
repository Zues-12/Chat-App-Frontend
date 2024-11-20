import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getMessages = createAsyncThunk('message/getMessages', async (roomId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/room/${roomId}`)
        return response.data;

    } catch (err) {
        console.log(err)
        return rejectWithValue({
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
            details: err?.response?.data?.message,
        });
    }
})

export const addMessage = createAsyncThunk('message/addMessage', async ({ roomId, content }, { rejectWithValue }) => {

    try {
        const response = await api.post('/message', { roomId, content })
        return response.data;
    } catch (err) {
        console.log(err)
        return rejectWithValue({
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
            details: err?.response?.data?.message,
        });
    }
})

const initialState = {
    list: [],
    error: null,
    status: 'idle',
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        receiveMessage(state, action) {
            state.list.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.status = 'loading';
                state.error = null
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.list = action.payload;
                state.status = 'idle';
                state.error = null
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.error = action.payload.details
                state.status = 'error';
            })
            .addCase(addMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                // state.list.push(action.payload)
                state.error = null
                state.status = 'idle';
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.error = action.payload.details
                state.status = 'error';
            })
    }
})

export const { receiveMessage } = messageSlice.actions;

export default messageSlice.reducer;