import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyingProducts: [
    {
      productId: null,
      buyingPrice: null,
      productTitle: null,
      qty: null,
    },
  ],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.buyingProducts.push(action.payload);
    },
    addMultipleProducts: (state, action) => {
      // console.log(action.payload);
      
      state.buyingProducts = action.payload;
      console.log( state.buyingProducts);
    },
    // fetchBuyingProducts: (state, action) => {
    //    state.buyingProducts =  
    // },
  },
});

export const { addProduct, addMultipleProducts, fetchBuyingProducts } = checkoutSlice.actions;
export default checkoutSlice.reducer;
