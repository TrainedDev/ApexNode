import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearCartService,
  createCartService,
  deleteProductFromCartService,
  fetchCartService,
  updateCartService,
} from "./api";

export const createCart = createAsyncThunk(
  "/create/cart",
  async (id, thunkApi) => {
    try {
      if (!id) {
        return thunkApi.rejectWithValue({ msg: "product id is required" });
      }
      const response = await createCartService(id);
      return response.data;
    } catch (error) {
      const errors = {
         message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

export const fetchCart = createAsyncThunk(
  "/fetch/cart",
  async (_, thunkApi) => {
    try {
      const response = await fetchCartService();
      return response.data;
    } catch (error) {
      const errors = {
         message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

export const clearCart = createAsyncThunk(
  "/clear/cart",
  async (id, thunkApi) => {
    try {
      const response = await clearCartService(id);
      return response.data;
    } catch (error) {
      const errors = {
         message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

export const removeProductFromCart = createAsyncThunk(
  "/remove/cart-product",
  async (id, thunkApi) => {
    try {
      const response = await deleteProductFromCartService(id);
      return response.data;
    } catch (error) {
      const errors = {
         message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

export const updateCart = createAsyncThunk(
  "/cart/update",
  async (data, thunkApi) => {
    try {
      const response = await updateCartService(data);
      console.log("received", response.data);
      return response.data;
    } catch (error) {
      console.log(error);

      const errors = {
         message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

const initialState = {
  createCart: {
    loading: false,
    error: null,
    data: null,
  },

  fetchCart: {
    loading: false,
    error: null,
    data: null,
  },

  clearCart: {
    loading: false,
    error: null,
    data: null,
  },

  removeProduct: {
    loading: false,
    error: null,
    data: null,
  },

  updateCart: {
    loading: false,
    error: null,
    data: null,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE CART
      .addCase(createCart.pending, (state) => {
        state.createCart.loading = true;
        state.createCart.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.createCart.loading = false;
        state.createCart.data = action.payload;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.createCart.loading = false;
        state.createCart.error = action.payload;
      })

      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.fetchCart.loading = true;
        state.fetchCart.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.fetchCart.loading = false;
        state.fetchCart.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        console.log(action.payload);

        state.fetchCart.loading = false;
        state.fetchCart.error = action.payload;
      })

      // CLEAR CART
      .addCase(clearCart.pending, (state) => {
        state.clearCart.loading = true;
        state.clearCart.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.clearCart.loading = false;
        state.clearCart.data = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.clearCart.loading = false;
        state.clearCart.error = action.payload;
      })

      // REMOVE PRODUCT
      .addCase(removeProductFromCart.pending, (state) => {
        state.removeProduct.loading = true;
        state.removeProduct.error = null;
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.removeProduct.loading = false;
        state.removeProduct.data = action.payload;
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.removeProduct.loading = false;
        state.removeProduct.error = action.payload;
      })

      // UPDATE CART
      .addCase(updateCart.pending, (state) => {
        state.updateCart.loading = true;
        state.updateCart.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.updateCart.loading = false;
        state.updateCart.data = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.updateCart.loading = false;
        state.updateCart.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
