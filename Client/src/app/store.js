import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/products/productSlice";
import profileReducer from "../features/profile/profileSlice";
import paymentReducer from "../features/checkout/paymentSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        product: productReducer,
        profile: profileReducer,
        payment: paymentReducer,
        order: orderReducer,
    },
});