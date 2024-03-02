import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import organizationSlice from './organizationSlice';
import productSlice from './productSlice';

const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        org: organizationSlice.reducer,
        product: productSlice.reducer
    }
})

export default store;