import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading:false,
    productList : []
}


export const addNewProduct = createAsyncThunk("/products/addnewproduct",
    async (formData)=>{
        const result = await axios.post("http://localhost:5000/api/admin/products/add",
            formData,
            {
            headers:{
                'Content-Type' : 'application/json'
            }
        }
    );
       return result?.data;
    }
)

export const getProduct = createAsyncThunk("/products/addnewproduct",
    async (formData)=>{
        const result = await axios.post("http://localhost:5000/api/admin/products/add",
            formData,
            {
            headers:{
                'Content-Type' : 'application/json'
            }
        }
    );
       return result?.data;
    }
)

//AdminProductsSlice
const AdminProductsSlice = createSlice({
    name:'adminProducts',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(addNewProduct.pending,(state,actions)=>{
                state.isLoading = actions?.payload?.success;
        })
        .addCase(addNewProduct.fulfilled,(state,actions)=>{
                state.isLoading = actions?.payload?.success;
                state.productList = actions?.payload?.products;
        })
        .addCase(addNewProduct.rejected,(state,actions)=>{
                state.isLoading = actions?.payload?.success;
                state.productList = null;
        })
    }
})

const {addProducts} = AdminProductsSlice.actions; 
export const productsSlice = AdminProductsSlice.reducer;

