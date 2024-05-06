"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    content: {
        heroSection: { title: '', subTitle: '', paragraph: '', whyChooseRVMVideoId: "", whyChooseRVMVideoTitle: "" },
        copyTokenSection: { text: "", etherWalletLink: "" },
        howToBuySection: { title: [], data: [], videoTitle: '', evmWalletVideoTitle: "", evmVideoId: '', rvmtSystemVideoTitle: "", rvmtSystemVideoTitle: "", rvmtVideoId: '' },
        whatIsRVMTokenSection: { title: '', paragraph: [] },
        whyChooseRVMSection: { title: '', subTitle: '', contents: [] },
        aboutRVMSection: { title: [], paragraph: '' },
        rvmOverviewSection: { title: '', paragraph: '' },
        tokenDistributionSection: { title: [], paragraph: '', table: [] },
        fundAllocationSection: { title: [], table: [] },
        roadmapSection: { title: "", paragraph: "", data: [], endParagraph: '' },
        ourTeamSection: { title: '', paragraph: '', members: [] },
        ourPartnersSection: { title: [], paragraph: '', partners: [] },
        featuredOnSection: { title: "", data: [] },
        pressReleaseSection: { title: "" },
        whitepaperSection: { title: '', paragraph: '' },
        faqSection: { title: [], paragraph: "", items: [] },
        contactUsSection: { title: '', subTitle: "", paragraph: '', links: { email: '', instagram: '', twitter: '', youTube: '', telegram: '' } },
        footerSection: { paragraph: '', rights: "" },
    },
    loading: true,
    error: null,
};

export const fetchHomeContent = createAsyncThunk('content/fetchHomeContent', async () => {
    const response = await fetch('/json/contents.json');
    if (!response.ok) {
        throw new Error('Failed to fetch content');
    }
    const data = await response.json();
    return data;
});

export const homeContentSlice = createSlice({
    name: 'homeContent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeContent.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHomeContent.fulfilled, (state, action) => {
                state.loading = false;
                state.content = action.payload;
            })
            .addCase(fetchHomeContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default homeContentSlice.reducer;
