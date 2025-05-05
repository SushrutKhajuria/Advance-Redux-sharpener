// src/App.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from './store/uiSlice';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      // Show pending notification
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!'
      }));

      const response = await fetch('https://advance-redux-cart-ea9e2-default-rtdb.firebaseio.com//cart.json', {
        method: 'PUT',
        body: JSON.stringify(cart)
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      // Show success notification
      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!'
      }));
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch(error => {
      // Show error notification
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: error.message
      }));
    });
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;