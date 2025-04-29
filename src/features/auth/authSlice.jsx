import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


const initialState = {
    user: null,
    token: null,
    loading: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.token = action.payload.data.token;
                state.loading = false;
                console.log(state)
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});


export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register', // اسم الـ action
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/register', formData); // استبدل هذا بالـ API endpoint الصحيح
            return response.data; // نعيد البيانات المستلمة من الـ API
        } catch (error) {
            return rejectWithValue(error.response.data); // إعادة خطأ الاستجابة من الـ API
        }
    }
);



export const authReducer = authSlice.reducer;
export const { logout, todo } = authSlice.actions;
