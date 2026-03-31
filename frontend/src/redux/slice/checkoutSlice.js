import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"


// Async Thunk to create a checkout session


export const createCheckout = createAsyncThunk("checkout/createCheckout", async (checkoutData, { rejectWithValue }) =>
{
    try {
        
        const response =  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`,checkoutData,
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

export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data; // Ye finalized order data hai
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
    name : "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error : null
    },
    reducers: {},
    extraReducers: (builder) =>
    {
        builder
            .addCase(createCheckout.pending, (state) =>
        {
            state.loading = true;
                state.error = null;
            })
         .addCase(createCheckout.fulfilled, (state,action) =>
        {
            state.loading = false;
            state.error = action.payload
         })
         .addCase(createCheckout.rejected, (state,action) =>
        {
            state.loading = false;
            state.error =  action.payload.message
            }).addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.checkout = action.payload; // ✅ Yaha state update hogi
        state.loading = false;
})
      
    }
})


export default checkoutSlice.reducer