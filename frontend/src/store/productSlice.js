import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// thunk
// you can call fetchUser using dispatch similer to other actions
export const fetchUser = createAsyncThunk("fetchUser", async()=>{

})

const productSlice = createSlice({
    name: "products",
    initialState:{ data: null},

    reducers:{
        setProduct:(state, action)=>{
            state.data = action.payload
        },
        addProduct:(state, action)=>{
            state.data = [...state.data, action.payload];
        },
        deleteProduct:(state, action)=>{
            state.data = state.data.filter(item => item._id !== action.payload.id)
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(fetchUser.fulfilled, (state, action)=>{

        })
        .addCase(fetchUser.pending, (state, action)=>{

        })
        .addCase(fetchUser.rejected, (state, action)=>{

        })
    }
});

export const productActions = productSlice.actions;
export default productSlice;