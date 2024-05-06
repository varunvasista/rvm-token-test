"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const fetchPressReleasesContent = createAsyncThunk('content/fetchPressReleasesContent', async () => {
    const response = await fetch('/json/press-releases.json');
    if (!response.ok) {
        throw new Error('Failed to fetch content');
    }
    const data = await response.json();
    return data;
});

export const pressReleasesContentSlice = createSlice({
    name: 'pressReleasesContent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPressReleasesContent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPressReleasesContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
            })
            .addCase(fetchPressReleasesContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default pressReleasesContentSlice.reducer;
