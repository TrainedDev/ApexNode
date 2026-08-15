import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProductService,
  cartProductService,
  deleteProductService,
  fetchAllProductService,
  fetchProductService,
} from "./api";

export const addProduct = createAsyncThunk(
  "/add/product",
  async (data, thunkApi) => {
    try {
      const response = await addProductService(data);

      return response.data;
    } catch (error) {
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);
export const fetchProduct = createAsyncThunk(
  "/fetch/product",
  async (id, thunkApi) => {
    try {
      const response = await fetchProductService(id);

      return response.data;
    } catch (error) {
      console.log(error);
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);
export const fetchProducts = createAsyncThunk(
  "/fetch/products",
  async (data, thunkApi) => {
    try {
      const response = await fetchAllProductService();

      return response.data;
    } catch (error) {
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);
export const updateProduct = createAsyncThunk(
  "/update/product",
  async (data, thunkApi) => {
    try {
      const response = await updateProduct(data);

      return response.data;
    } catch (error) {
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);
export const deleteProduct = createAsyncThunk(
  "/product/delete",
  async (id, thunkApi) => {
    try {
      const response = await deleteProductService(id);
      return response.data;
    } catch (error) {
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);
export const cartProducts = createAsyncThunk(
  "/products/cart",
  async (data, thunkApi) => {
    try {
      const response = await cartProductService(data);
      return response.data;
    } catch (error) {
      const errors = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(errors);
    }
  },
);

const initialState = {
  fetchProducts: {
    data: [],
    loading: false,
    error: null,
  },

  fetchProduct: {
    data: null,
    loading: false,
    error: null,
  },

  addProduct: {
    data: null,
    loading: false,
    error: null,
  },

  updateProduct: {
    data: null,
    loading: false,
    error: null,
  },

  deleteProduct: {
    data: null,
    loading: false,
    error: null,
  },
  cartProducts: {
    data: null,
    loading: false,
    error: null,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.fetchProducts.loading = true;
        state.fetchProducts.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.fetchProducts.loading = false;
        state.fetchProducts.data = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.fetchProducts.loading = false;
        state.fetchProducts.error = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.fetchProduct.loading = true;
        state.fetchProduct.error = null;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.fetchProduct.loading = false;
        state.fetchProduct.data = action.payload;
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.fetchProduct.loading = false;
        state.fetchProduct.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.addProduct.loading = true;
        state.addProduct.error = null;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.addProduct.loading = false;
        state.addProduct.data = action.payload;
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.updateProduct.loading = false;
        state.updateProduct.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.updateProduct.loading = true;
        state.updateProduct.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateProduct.loading = false;
        state.updateProduct.data = action.payload;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProduct.loading = false;
        state.updateProduct.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.deleteProduct.loading = true;
        state.deleteProduct.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteProduct.loading = false;
        state.deleteProduct.data = action.payload;
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteProduct.loading = false;
        state.deleteProduct.error = action.payload;
      })
      .addCase(cartProducts.pending, (state) => {
        state.cartProducts.loading = true;
        state.cartProducts.error = null;
      })

      .addCase(cartProducts.fulfilled, (state, action) => {
        state.cartProducts.loading = false;
        state.cartProducts.data = action.payload;
      })

      .addCase(cartProducts.rejected, (state, action) => {
        state.cartProducts.loading = false;
        state.cartProducts.error = action.payload;
      });
  },
});

export default productSlice.reducer;
