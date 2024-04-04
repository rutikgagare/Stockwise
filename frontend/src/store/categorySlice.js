import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunk
// you can call fetchUser using dispatch similer to other actions
export const fetchUser = createAsyncThunk("fetchUser", async () => {});

const categorySlice = createSlice({
  name: "categorys",
  initialState: { data: [] },

  reducers: {
    setCategory: (state, action) => {
      state.data = action.payload;
    },
    addCategory: (state, action) => {
      state.data = [...state.data, action.payload];
    },
    deleteCategory: (state, action) => {
      state.data = state.data.filter((item) => item._id !== action.payload.id);
    },
    updateCategory: (state, action) => {
      state.data = state.data.map((item) => {
        if (item._id === action.payload._id) {
          return {
            numberOfAssets: item.numberOfAssets,
            ...action.payload,
          };
        } else {
          return item;
        }
      });
    },
    incrementItemCount: (state, action) => {
      state.data = state.data.map((item) => {
        if (item._id === action.payload.categoryId) {
          return {
            ...item,
            numberOfAssets: item.numberOfAssets
              ? item.numberOfAssets + action.payload.quantity
              : action.payload.quantity,
          };
        }
        return item;
      });
    },

    decrementItemCount: (state, action) => {
      state.data = state.data.map((item) => {
        if (item._id === action.payload.categoryId) {
          return {
            ...item,
            numberOfAssets: item.numberOfAssets
              ? item.numberOfAssets - action.payload.quantity
              : action.payload.quantity,
          };
        }
        return item;
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {})
      .addCase(fetchUser.pending, (state, action) => {})
      .addCase(fetchUser.rejected, (state, action) => {});
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice;
