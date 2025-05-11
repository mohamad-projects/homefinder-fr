import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


const initialState = {
    user: null,
    token: null,
    loading: null,
    error: null,
    profile:null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
        removeRealEstateFromProfile: (state, action) => {
        const itemId = action.payload;

        const currentProfile = state.profile ? JSON.parse(JSON.stringify(state.profile)) : null;

        if (currentProfile?.listings?.real_estate) {
            
            const filteredRealEstate = currentProfile.listings.real_estate.filter(
            item => {
                return item?.id !== itemId;
            }
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
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.token = action.payload.data.token;
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
            return response.data;profile
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);




export const authReducer = authSlice.reducer;
export const { logout, todo,removeRealEstateFromProfile  } = authSlice.actions;
