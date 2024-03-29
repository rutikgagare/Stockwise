import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("fetchUser", async()=>{

})

const ticketAdminSlice = createSlice({
    name: "ticketsAdmin",
    initialState:{ data: []},

    reducers:{
        setTickets:(state, action)=>{
            state.data = action.payload
        },
        updateTicket:(state, action)=>{
            state.data = state.data.map(item => {
                if(item._id === action.payload._id){
                    return action.payload;
                }
                return item;
            })
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

export const ticketAdminActions = ticketAdminSlice.actions;
export default ticketAdminSlice;