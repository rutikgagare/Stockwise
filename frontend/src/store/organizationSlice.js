import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// thunk
// you can call fetchUser using dispatch similer to other actions
export const fetchUser = createAsyncThunk("fetchUser", async()=>{

})

const organizationSlice = createSlice({
    name: "organization",
    initialState:{ organization: null},

    reducers:{
        setOrg:(state, action)=>{
            state.organization = action.payload
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

export const organizationActions = organizationSlice.actions;
export default organizationSlice;