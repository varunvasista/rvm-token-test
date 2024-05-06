"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DATA_URL = '/json/press-releases.json';

// Async thunk for fetching details by ID
export const fetchPressReleaseDetailsById = createAsyncThunk(
    'details/fetchById',
    async (id, { getState, requestId, rejectWithValue }) => {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) {
                throw new Error('Could not fetch data');
            }
            const data = await response.json();
            const item = data.data.find((item) => {
                return item.id.toString() === id;
            });
            
            return item ? item.details : rejectWithValue('Item not found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    details: null,
    loading: true,
    error: null,
};

const pressReleaseDetailsSlice = createSlice({
    name: 'pressReleaseDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPressReleaseDetailsById.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPressReleaseDetailsById.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload;
            })
            .addCase(fetchPressReleaseDetailsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default pressReleaseDetailsSlice.reducer;
