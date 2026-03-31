import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"


// Async Thunk to fetch products by Collectionand optional Fillter



export const fetchProductByFilters = createAsyncThunk("products/fetchByFilters", async({
    collection,
    sizes,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,   // <-- Fixed the 'searach' typo here!
    category,
    material,
    brand,
    limit
}) => {
    const query = new URLSearchParams();
    
    // THE FIX: Only append collection if it exists AND is not "all"
    if(collection && collection !== "all") query.append("collection", collection);
    
    // The rest of your checks naturally ignore empty strings ("") because "" is falsy!
    if(sizes) query.append("sizes", sizes);
    if(color) query.append("color", color);
    if(gender) query.append("gender", gender);
    if(minPrice) query.append("minPrice", minPrice);
    if(maxPrice) query.append("maxPrice", maxPrice);
    if(sortBy) query.append("sortBy", sortBy);
    if(search) query.append("search", search); // <-- Make sure to match the fixed spelling
    if(category) query.append("category", category);
    if(material) query.append("material", material);
    if(brand) query.append("brand", brand);
    if(limit) query.append("limit", limit);

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`);
    return response.data;
});
//Async Thunk to fetch a single product id
export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`)
    return response.data;
}
);


// add a thunk to fetch similiar peoduct

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }) => {
    const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData,
    
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }

    )

    return response.data;
    
});


// Async thunl to fetch similiar products

export const fetchSimiliarProducts = createAsyncThunk("products/fetchSimiliarProducts", async (id) => {
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similiar/${id}`)

    return response.data;

})


const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null, // store the details of single product
        similiarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection:"",
        },
    },
    reducers: {
        setFilters: (state, action) =>
        {
            state.filters = {...state.filters, ...action.payload}
        },
        clearFilter: (state) =>
        {
            state.filters = {
                 category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection:"",
            }
        },
    },
    extraReducers: (builder) =>
    {
        builder
        // handle fetching products with filter 
            .addCase(fetchProductByFilters.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(fetchProductByFilters.fulfilled, (state, action) =>
            {
                state.loading = false,
                    state.products = Array.isArray(action.payload) ? action.payload : []; 
            })
            .addCase(fetchProductByFilters.rejected, (state, action) => {

                state.loading = false
                state.error = action.error.message
            })
        //handle fetching single product details 
         .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) =>
            {
                state.loading = false,
                    state.selectedProduct = action.payload
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {

                state.loading = false
                state.error = action.error.message
            })
        // handle updating the product
         .addCase(updateProduct.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) =>
            {
                state.loading = false;
                const updateProduct = action.payload
                const  index = state.products.findIndex((product)=> product._id === updateProduct._id
                )

                if (index != -1)
                {
                    state.products[index] = updateProduct
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {

                state.loading = false
                state.error = action.error.message
            })
             .addCase(fetchSimiliarProducts.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(fetchSimiliarProducts.fulfilled, (state, action) =>
            {
                state.loading = false,
                    state.similiarProducts = action.payload
            })
            .addCase(fetchSimiliarProducts.rejected, (state, action) => {

                state.loading = false
                state.error = action.error.message
            })
    }
})

export const { setFilters, clearFilter } = productSlice.actions;
export default  productSlice.reducer