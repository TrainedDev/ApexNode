import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginService,
  logoutService,
  registerService,
  userAuthStatusService,
} from "./api";

export const login = createAsyncThunk("users/login", async (data, thunkAPI) => {
  try {
    return await loginService(data);
  } catch (error) {
    const errors = {
      message: error?.response?.data?.message || "something went wrong",
      status: error?.response?.data?.status || 500,
    };
    return thunkAPI.rejectWithValue(errors);
  }
});
export const userAuthStatus = createAsyncThunk(
  "users/auth/status",
  async (_, thunkAPI) => {
    try {
      return await userAuthStatusService();
    } catch (error) {
      const errors = {
        message: error?.response?.data?.message || "something went wrong",
        status: error?.response?.data?.status || 500,
      };
      return thunkAPI.rejectWithValue(errors);
    }
  },
);
export const userRegister = createAsyncThunk(
  "users/userRegister",
  async (data, thunkAPI) => {
    try {
      return await registerService(data);
    } catch (error) {
      const errors = {
        message: error?.response?.data?.message || "something went wrong",
        status: error?.response?.data?.status || 500,
      };
      return thunkAPI.rejectWithValue(errors);
    }
  },
);

export const userLogout = createAsyncThunk(
  "users/userLogout",
  async (_, thunkAPI) => {
    try {
      const response = await logoutService();
      return response.data;
    } catch (error) {
      const errors = {
        message: error?.response?.data?.message || "something went wrong",
        status: error?.response?.data?.status || 500,
      };
      return thunkAPI.rejectWithValue(errors);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Grouped logically by feature
    auth: {
      data: null,
      loading: false,
      error: null,
    },

    user: {
      data: null,
      loading: false,
      error: null,
    },

    userAuthStatus: {
      data: null,
      loading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.auth.data = action.payload;
        state.auth.loading = false;
        state.auth.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.auth.error = action.payload;
        state.auth.loading = false;
        state.auth.data = null;
      })
      .addCase(userAuthStatus.pending, (state) => {
        state.userAuthStatus.loading = true;
        state.userAuthStatus.error = null;
      })
      .addCase(userAuthStatus.fulfilled, (state, action) => {
        state.userAuthStatus.data = action.payload;
        state.userAuthStatus.error = null;
        state.userAuthStatus.loading = false;
      })
      .addCase(userAuthStatus.rejected, (state, action) => {
        state.userAuthStatus.error = action.payload;
        state.userAuthStatus.data = null;
        state.userAuthStatus.loading = false;
      })
      .addCase(userRegister.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.auth.data = action.payload;
        state.auth.error = null;
        state.auth.loading = false;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.auth.data = null;
        state.auth.loading = false;
        state.auth.error = action.payload;
      })
      .addCase(userLogout.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.auth.data = null;
        state.auth.error = null;
        state.auth.loading = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.auth.data = null;
        state.auth.loading = false;
        state.auth.error = action.payload;
      });
  },
});

export default authSlice.reducer;
