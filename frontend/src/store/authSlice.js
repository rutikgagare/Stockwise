import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// thunk
// you can call fetchUser using dispatch similer to other actions
export const fetchUser = createAsyncThunk("fetchUser", async()=>{

})

const authSlice = createSlice({
    name: "user",
    initialState:{ user: null},
    reducers:{
        login:(state, action)=>{
            state.user = action.payload
        },
        logout:(state)=>{
            state.user = null
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

export const authActions = authSlice.actions;
export default authSlice;