import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitContactForm = createAsyncThunk(
    'form/submit',
    async ({ name, email, telegram, message }) => {
        const response = await fetch('/api/send-contact-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, telegram, message })
        });
        return response.json();
    }
);

const contactFormSlice = createSlice({
    name: 'contactForm',
    initialState: {
        loading: false,
        error: null,
        response: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitContactForm.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitContactForm.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(submitContactForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default contactFormSlice.reducer;
