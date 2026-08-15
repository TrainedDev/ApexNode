import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { razorpayWebHookService, verifyPaymentService } from "./api";

export const verifyPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async (data, thunkApi) => {
    try {
      const response = await verifyPaymentService(data);
      console.log(response);
      return response.data;
    } catch (error) {
      const err = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(err);
    }
  },
);

export const razorpayWebHook = createAsyncThunk(
  "checkout/razorpayWebHook",
  async (data, thunkApi) => {
    try {
      const response = await razorpayWebHookService(data);
      return response.data;
    } catch (error) {
      const err = {
        message:
          error?.response?.data?.message ||
          error?.message ||
          "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      };
      return thunkApi.rejectWithValue(err);
    }
  },
);

const initialState = {
  verifyPayment: {
    data: null,
    loading: false,
    error: null,
  },

  razorpayWebHook: {
    data: null,
    loading: false,
    error: null,
  },
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // VERIFY PAYMENT
      .addCase(verifyPayment.pending, (state) => {
        state.verifyPayment.loading = true;
        state.verifyPayment.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifyPayment.loading = false;
        state.verifyPayment.data = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifyPayment.loading = false;
        state.verifyPayment.error = action.payload;
      })

      // RAZORPAY WEBHOOK
      .addCase(razorpayWebHook.pending, (state) => {
        state.razorpayWebHook.loading = true;
        state.razorpayWebHook.error = null;
      })
      .addCase(razorpayWebHook.fulfilled, (state, action) => {
        state.razorpayWebHook.loading = false;
        state.razorpayWebHook.data = action.payload;
      })
      .addCase(razorpayWebHook.rejected, (state, action) => {
        state.razorpayWebHook.loading = false;
        state.razorpayWebHook.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
