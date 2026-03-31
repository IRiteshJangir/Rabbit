import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"


// Helper function to load cart from localStorage

// 1. The Bulletproof Loader
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    
    // Safety check: Only parse if it exists AND isn't a broken string
    if (storedCart && storedCart !== "undefined" && storedCart !== "null") {
        return JSON.parse(storedCart);
    }
    
    // Default fallback
    return { products: [] };
};

// 2. The Bulletproof Saver
const saveCart = (cart) => {
    // Safety check: Only save to storage if the cart actually has data!
    if (cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
};


// fetch cart for user or guest
export const fetchCart = createAsyncThunk("cart/fetchcart", async ({ userId, guestId }, { rejectWithValue }) => {
    
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            params:{userId,guestId}
        })
        return response.data

    } catch (error) {
        console.log(error);
        return rejectWithValue (error.response.data)
        
        
    }
})

// Add an item to the cart for a user or guest

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) =>
{
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            size,
            color,
            guestId,
            userId
        })
        return response.data
    } catch (error) {
        // console.log(error);
        rejectWithValue(error.response.data)
        
    }
}
)

// update the quantity of an items  in the cart

export const updateCartItemQuantity = createAsyncThunk("cart/cerateAsyncThunk", async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) =>

{
    try {

        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
            productId,
            quantity,
            guestId,
            userId,
            size,
            color,

            }
        )
        return response.data;
        
    } catch (error) {

        return rejectWithValue(error.response.data)
        
    }
})

// Remove  an item from the cart 
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) =>
{
    try {

        const response = await axios({
            method: "DELETE",
            url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: { productId, quantity, guestId, userId, size, color }
        });

        return response.data 
        
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})


//merge guest cart into user cart

export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) =>
{
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { guestId, user },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                },
            }
        )
              return response.data 


    } catch (error) {
        rejectWithValue(error.response.data)
        
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error : null,
    },
    reducers:
    {
        clearCart: (state) =>
        {
            state.cart = { products: [] };
            localStorage.removeItem("cart")
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(fetchCart.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            }).addCase(fetchCart.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.cart = action.payload;
                saveCart(action.payload)
                 
            }).addCase(fetchCart.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.error.message || "Failed To Fetch Cart";
            })
         .addCase(addToCart.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            }).addCase(addToCart.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.cart = action.payload;
                saveCart(action.payload)
                 
            }).addCase(addToCart.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.payload?.message || "Failed To add to Cart";
            })
         .addCase(updateCartItemQuantity.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            }).addCase(updateCartItemQuantity.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.cart = action.payload;
                saveCart(action.payload)
                 
            }).addCase(updateCartItemQuantity.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity to ";
            })
                 .addCase(removeFromCart.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            }).addCase(removeFromCart.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.cart = action.payload;
                saveCart(action.payload)
                 
            }).addCase(removeFromCart.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.payload?.message || "Failed To remove Item";
            })
         .addCase(mergeCart.pending, (state) =>
            {
                state.loading = true;
                state.error = null;
            }).addCase(mergeCart.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.cart = action.payload;
                saveCart(action.payload)
                 
            }).addCase(mergeCart.rejected, (state,action) =>
            {
                state.loading = false;
                state.error = action.payload?.message || "Failed To merge Cart";
            })
        
        
        
    }
}) 


export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer

