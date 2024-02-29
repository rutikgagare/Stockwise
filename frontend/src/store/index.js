import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import organizationSlice from './organizationSlice';

const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        org: organizationSlice.reducer
    }
})

export default store;