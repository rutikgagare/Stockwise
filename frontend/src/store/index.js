import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import organizationSlice from './organizationSlice';
import categorySlice from './categorySlice.js';
import inventorySlice from './inventorySlice.js';
const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        org: organizationSlice.reducer,
        category: categorySlice.reducer,
        inventory: inventorySlice.reducer,
    }
})

export default store;