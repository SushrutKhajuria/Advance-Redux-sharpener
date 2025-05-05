// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './uiSlice';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    changed: false // Added flag to track local changes
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
      state.totalQuantity++;
      state.changed = true; // Mark as changed
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
      state.totalQuantity--;
      state.changed = true; // Mark as changed
    },
    replaceCart(state, action) {
      state.items = action.payload.items || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
      // Don't mark as changed when replacing from server
    }
  }
});

// Thunk action creator for sending cart data
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!'
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        'https://advance-redux-cart-ea9e2-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }
    };

    try {
      await sendRequest();
      
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!'
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message
        })
      );
    }
  };
};

// Thunk action creator for fetching cart data
export const fetchCartData = () => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Fetching...',
        message: 'Fetching cart data!'
      })
    );

    try {
      const response = await fetch(
        'https://advance-redux-cart-ea9e2-default-rtdb.firebaseio.com/cart.json'
      );

      if (!response.ok) {
        throw new Error('Fetching cart data failed!');
      }

      const data = await response.json();
      
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Fetched cart data successfully!'
        })
      );
      
      dispatch(
        cartSlice.actions.replaceCart({
          items: data.items || [],
          totalQuantity: data.totalQuantity || 0
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: error.message
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;