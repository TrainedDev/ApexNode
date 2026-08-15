import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
 createProfileService,
 getProfileService,
 updateProfileService
} from "./api";

export const createProfile = createAsyncThunk(
  "users/create/profile",
  async (data, thunkAPI) => {
    try {
      return await createProfileService(data);
    } catch (error) {     
        const errors = {
          message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      } 
      return thunkAPI.rejectWithValue(errors);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "users/get/profile",
  async (_, thunkAPI) => {
    try {
      return await getProfileService();
    } catch (error) {
      const errors = {
          message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      } 
      return thunkAPI.rejectWithValue(errors);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "users/update/profile",
  async (data, thunkAPI) => {
    try {
      return await updateProfileService(data);
    } catch (error) {
        const errors = {
          message: error?.response?.data?.message || error?.message || "something went wrong",
        status: error?.response?.data?.status || error?.status || 500,
      } 
      return thunkAPI.rejectWithValue(errors);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
      data: null,
      loading: false,
      error: {
        createProfileErr: null,
        updateProfileErr: null,
        fetchProfileErr: null,
      },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error.createProfileErr = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
        state.error.createProfileErr = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.error.createProfileErr = action.payload;
        state.loading = false;
        state.data = null;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error.fetchProfileErr = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
        state.error.fetchProfileErr = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error.fetchProfileErr = action.payload;
        state.loading = false;
        state.data = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error.updateProfileErr = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
        state.error.updateProfileErr = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error.updateProfileErr = action.payload;
        state.loading = false;
        state.data = null;
      })
  }
});

export default profileSlice.reducer;
