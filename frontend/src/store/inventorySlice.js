import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// thunk
// you can call fetchUser using dispatch similer to other actions
export const fetchUser = createAsyncThunk("fetchUser", async()=>{

})

const inventorySlice = createSlice({
    name: "inventory",
    initialState:{ data: null},

    reducers:{
        setInventory:(state, action)=>{
            state.data = action.payload
        },
        addItem:(state, action)=>{
            state.data = [...state.data, action.payload];
        },
        deleteItem:(state, action)=>{
            state.data = state.data.filter(item => item._id !== action.payload.id)
        },
        // updateCategory:(state, action)=>{
        //     state.data = state.data.map(item =>{
        //         if(item._id === action.payload._id){
        //             return action.payload;
        //         }
        //         else{
        //             return item;
        //         }
        //     })
        // }
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

export const inventoryActions = inventorySlice.actions;
export default inventorySlice;