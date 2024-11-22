import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../utils/api";


// ** Message Thunks **//

/**
 * Defines an asynchronous thunk for getting all messages for a chat
 *
 * @param {Object} reciever - An object containing userId of the receiver
 * @param {Object} thunkAPI - The Redux Thunk API object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<Object>} A promise that resolves with all messages data or rejects with an error object.
 */

export const getMessages = createAsyncThunk('message/getMessages', async (receiver, { rejectWithValue }) => {
    try {
        const response = await api.get(`/message/${receiver}`);
        return response.data;
    } catch (err) {
        return rejectWithValue({
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
            details: err?.response?.data?.message,
        });
    }
})

/**
 * Defines an asynchronous thunk for sending a message to a user
 *
 * @param {Object} reciever - An object containing userId of the receiver and the content of the message
 * @param {Object} thunkAPI - The Redux Thunk API object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<Object>} A promise that resolves with the added message object or rejects with an error object.
 */

export const addMessage = createAsyncThunk('message/addMessage', async ({ receiver, content }, { rejectWithValue }) => {

    try {
        const response = await api.post('/message', { receiver, content })
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

        // ** Reducer to add the message received via socket to the list object**/
        receiveMessage(state, action) {
            state.list.push(action.payload);
        },

    },
    extraReducers: (builder) => {
        builder

            // ** Pending State Updates (Triggered when async operations start) **/
            .addCase(getMessages.pending, (state) => {
                state.status = 'loading';
                state.error = null
            })
            .addCase(addMessage.pending, (state) => {
                state.status = 'loading';
            })

            // ** Fulfilled State Updates (Triggered when async operations succeeds) **/
            .addCase(getMessages.fulfilled, (state, action) => {
                state.list = action.payload;
                state.status = 'idle';
                state.error = null
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                state.list.push(action.payload)
                state.error = null
                state.status = 'idle';
            })

            // ** Rejected State Updates (Triggered when async operations is rejected) **/
            .addCase(getMessages.rejected, (state, action) => {
                state.error = action.payload.details
                state.status = 'error';
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.error = action.payload.details
                state.status = 'error';
            })
    }
})

export const { receiveMessage } = messageSlice.actions;

export default messageSlice.reducer;