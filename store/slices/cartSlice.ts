import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '../../types';
import { cartService } from '../../services/api';

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        return await cartService.getCart();
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ customizationId, quantity }: { customizationId: string; quantity: number }) => {
        return await cartService.addToCart(customizationId, quantity);
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
        return await cartService.updateCartItem(itemId, quantity);
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: string) => {
        return await cartService.removeFromCart(itemId);
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async () => {
        return await cartService.clearCart();
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder.addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading = false;
            state.cart = action.payload;
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch cart';
        });

        // Add to cart
        builder.addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading = false;
            state.cart = action.payload;
        });
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to add to cart';
        });

        // Update cart item
        builder.addCase(updateCartItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading = false;
            state.cart = action.payload;
        });
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update cart item';
        });

        // Remove from cart
        builder.addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading = false;
            state.cart = action.payload;
        });
        builder.addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to remove from cart';
        });

        // Clear cart
        builder.addCase(clearCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(clearCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading = false;
            state.cart = action.payload;
        });
        builder.addCase(clearCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to clear cart';
        });
    }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
