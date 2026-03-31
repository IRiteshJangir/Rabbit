import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"


// async thunk to fetch admin product

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`

export const fetchAdminProduct = createAsyncThunk("adminProducts/fetchAdminProduct", async () =>
{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        {
            headers:
            {
                Authorization : `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return response.data
})


// asynk thunk to create a new  product

export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => { 

    const response = await axios.post(`${API_URL}/api/admin/product`, productData, {
        
        headers:
        {
            Authorization : `Bearer ${localStorage.getItem("userToken")}`
        }
    })
    return response.data 
})

// asynk to update an existing data

export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({ id, productData }) =>
{
    const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData,
        {
            headers:
            {
                Authorization : `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )

    return response.data
})

// async thunk to delete the products

export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id) =>
{
    await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
            Authorization : `Bearer ${localStorage.getItem("userToken")}`
        }
    })
    return id 
})

const adminProductSlice = createSlice(
    {
        name: "adminProducts",
        initialState: {
            product: [],
            loading: false,
            error : null
        },
        resucers: {},
        extraReducers: (builder) =>
        {
            builder
                .addCase(fetchAdminProduct.pending, (state) => {
                    state.loading = true;
                }).addCase(fetchAdminProduct.fulfilled, (state, action) => {
                    state.loading = false;
                    state.products = action.payload

                })
                .addCase(fetchAdminProduct.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message
                })
                // create product
            
                .addCase(createProduct.fulfilled, (state, action) => {
                    state.products.push(action.payload)
                })
                // update products
                .addCase(updateProduct.fulfilled, (state, action) => {

                    console.log(action.payload)
                    const index = state.products.findIndex(
                        (product) => product._id === action.payload._id
                      );
                        if (index !== -1)
                        {
                        state.products[index]= action.payload 
                        }
                    })
            // delete product
                .addCase(deleteProduct.fulfilled, (state, action) =>
                {
                    state.products = state.products.filter(
                        (product)=> product._id !== action.payload
                    )
            })
        } 
    }
)


export default adminProductSlice.reducer;