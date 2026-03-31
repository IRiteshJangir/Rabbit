import { createSlice, createAsyncThunk, __DO_NOT_USE__ActionTypes } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all orders

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const token = localStorage.getItem("userToken");
console.log("My Token is:", token); // Is this printing a long string, or 'null'?
export const fetchAllOrder = createAsyncThunk("adminOrders/fetchAllOrder", async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) =>
{
    try {
        const response = await axios.get(`${API_URL}/api/admin/orders`,
            {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        console.log("fetch all order",response.data)
        return response.data
    } catch (error) {
       return  rejectWithValue(error.response.data)
    }
})

// update orde deliver Status

export const updateOrderStatus = createAsyncThunk("adminOrders/updateOrderStatus", async ({id,status}, { rejectWithValue }) =>
{
    try {
        const response = await axios.put(`${API_URL}/api/admin/orders/${id}`,{status},
            {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return response.data
    } catch (error) {
       return  rejectWithValue(error.response.data)
    }
})

// delete an order

export const deleteOrder = createAsyncThunk("adminOrders/deleteOrder", async (id, { rejectWithValue }) =>
{
    try {
        await axios.delete(`${API_URL}/api/admin/orders/${id}`,
            {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return id;
    } catch (error) {
       return  rejectWithValue(error.response.data)
    }
})


const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState:{
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null
        
},
reducers: {},
    extraReducers: (builder) =>
    {
        builder
        // fetch all order
            .addCase(fetchAllOrder.pending, (state) =>
            {
                state.loading = true;
                state.error = null
            })
         .addCase(fetchAllOrder.fulfilled, (state,action) =>
            {
                state.loading = false;
             state.orders = action.payload
             state.totalOrders = action.payload.length


             // calculate total sales
             const totalSales = action.payload.reduce((acc, order) => {
                 return acc + order.totalPrice
             }, 0);
             state.totalSales = totalSales

         })
         .addCase(fetchAllOrder.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.payload.message
         })
        // update Order Status
            .addCase(updateOrderStatus.fulfilled, (state, action) =>
            {
                const updateOrder = action.payload;
                console.log("update user status with user name", updateOrder)
                const orderIndex = state.orders.findIndex((order) => order._id === updateOrder._id)
                if (orderIndex !== -1)
                {
                    state.orders[orderIndex] = updateOrder;
                }
            })
        // delete am order
            .addCase(deleteOrder.fulfilled, (state, action) =>
            {
                state.orders = state.orders.filter((order)=>order._id !== action.payload)
        })
    }
})


export default adminOrderSlice.reducer