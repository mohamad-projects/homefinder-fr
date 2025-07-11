// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    user: null,
    token: null,
    loading: null,
    error: null,
    profile: null,
    realEstateDetails: null,
    userRole: null, // سيبقى هنا ولكن لن نعتمد عليه بشدة بدون تعديل الباك
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.profile = null;
            state.userRole = null;
        },
        removeRealEstateFromProfile: (state, action) => {
            const itemId = action.payload;
            const currentProfile = state.profile ? JSON.parse(JSON.stringify(state.profile)) : null;

            if (currentProfile?.listings?.real_estate) {
                const filteredRealEstate = currentProfile.listings.real_estate.filter(
                    item => item?.id !== itemId
                );
                state.profile = {
                    ...currentProfile,
                    listings: {
                        ...currentProfile.listings,
                        real_estate: filteredRealEstate
                    }
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRealEstateDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getRealEstateDetails.fulfilled, (state, action) => {
                state.realEstateDetails = action.payload;
                state.loading = false;
            })
            .addCase(getRealEstateDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.token = action.payload.data.token;
                // لا نعتمد على userRole هنا بدون تعديل الباك
                // state.userRole = action.payload.data.role;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.token = action.payload.data.token;
                // لا نعتمد على userRole هنا بدون تعديل الباك
                // state.userRole = action.payload.data.role;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(profile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(profile.fulfilled, (state, action) => {
                state.profile = action.payload.data;
                // لا نعتمد على userRole هنا بدون تعديل الباك
                // state.userRole = action.payload.data.role || state.userRole;
                state.loading = false;
            })
            .addCase(profile.rejected, (state, action) => {
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
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/register', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const profile = createAsyncThunk(
    'auth/profile',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/profile/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getRealEstateDetails = createAsyncThunk(
    'realEstate/getDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/RealEstate/getDetails/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const authReducer = authSlice.reducer;
export const { logout, removeRealEstateFromProfile } = authSlice.actions;