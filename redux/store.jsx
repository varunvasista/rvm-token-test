"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/redux/slices/counter";
import homeContentSlice from "./slices/homeContentSlice";
import contactFormSlice from "./slices/contactFormSlice";
import pressReleasesContentSlice from "./slices/pressReleasesContentSlice";
import pressReleaseDetailsSlice from "./slices/pressReleaseDetailsSlice";
import setTokenSlice from "./slices/setTokenSlice";


const rootReducer = combineReducers({
    counter: counterReducer,
    homeContent: homeContentSlice,
    contactFrom: contactFormSlice,
    pressReleasesContent: pressReleasesContentSlice,
    PressReleaseDetails: pressReleaseDetailsSlice,
    token: setTokenSlice,
},);

export const store = configureStore({
    reducer: rootReducer,

});
