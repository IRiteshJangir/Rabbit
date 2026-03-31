import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"


//  Async Thunk to fetch users

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { rejectWithValue }) =>
{
     try {
        
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {
             headers: {
                 Authorization : `Bearer ${localStorage.getItem("userToken")}`
             },
         }
         );
         return response.data
         
     } catch (error) {
        return rejectWithValue(error.respose.data)
     }
})

// Async Thunk to fetch orders Details by ID

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (orderId, { rejectWithValue }) =>
{
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
         return response.data

    } catch (error) {
        return rejectWithValue(error.respose.data)
        
    }
})


const orderSlice = createSlice({
    name: "orders",
    initialState :{
     orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
     error : null,
    },
    reducers: [],
    extraReducers: (builder) =>
    {
        builder //fetch user order
            .addCase(fetchUserOrders.pending, (state) =>
            {
                state.loading = true;
                state.error = null
            })
        .addCase(fetchUserOrders.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.orders = action.payload
        })
        .addCase(fetchUserOrders.rejected, (state,action) =>
            {
                state.loading = true;
               state.error = action.payload?.message || action.error?.message || "Something went wrong";
        })
        //fetch order details 
               .addCase(fetchOrderById.pending, (state) =>
            {
                state.loading = true;
                state.error = null
            })
        .addCase(fetchOrderById.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.orderDetails = action.payload
        })
        .addCase(fetchOrderById.rejected, (state,action) =>
            {
                state.loading = true;
                state.error = action.payload.message
        })
    },
})

export default orderSlice.reducer; 