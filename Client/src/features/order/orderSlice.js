import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderService, fetchOrderService } from "./api";

export const createOrder = createAsyncThunk(
  "/create/order",
  async (data, thunkApi) => {
    try {
      const response = await createOrderService(data);
      return response.data;
    } catch (error) {
      // console.log(error.message, error.response, error.msg);

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

export const fetchOrder = createAsyncThunk(
  "/fetch/order",
  async (_, thunkApi) => {
    try {
      const response = await fetchOrderService();

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
  createOrder: {
    data: null,
    loading: false,
    error: null,
  },

  fetchOrder: {
    data: null,
    loading: false,
    error: null,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.createOrder.loading = true;
        state.createOrder.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.error = action.payload;
      })

      // FETCH ORDER
      .addCase(fetchOrder.pending, (state) => {
        state.fetchOrder.loading = true;
        state.fetchOrder.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.fetchOrder.loading = false;
        state.fetchOrder.data = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.fetchOrder.loading = false;
        state.fetchOrder.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
