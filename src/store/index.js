// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer
  }
});

export default store;