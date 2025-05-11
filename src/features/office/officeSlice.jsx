import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    sendRequest: [],
    office: [],
    officeDetails:[],
    loading: null,
    error: null,

};

const officeSlice = createSlice({
    name: 'office',
    initialState,
    reducers: {
        // ...
    },
    extraReducers: (builder) => {
        builder
            // Handle getOffice cases
            .addCase(getOffice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOffice.fulfilled, (state, action) => {
                state.office = action.payload.data;
                state.loading = false;
            })
            .addCase(getOffice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle indexRequest cases
            .addCase(indexRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(indexRequest.fulfilled, (state, action) => {
                state.sendRequest = action.payload.data;
                state.loading = false;
            })
            .addCase(indexRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle sendRequest cases
            .addCase(sendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendRequest.fulfilled, (state, action) => {
                state.sendRequest.push(action.payload.data);
                state.loading = false;
            })
            .addCase(sendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle deleteRequest cases
            .addCase(deleteRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRequest.fulfilled, (state, action) => {
                state.sendRequest = state.sendRequest.filter(
                    request => request.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle officeDetails cases
            .addCase(getOfficeDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOfficeDetails.fulfilled, (state, action) => {
                state.officeDetails = action.payload
            })
            .addCase(getOfficeDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});



export const getOffice = createAsyncThunk(
    'office/indexRequest',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('admin/users');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const getOfficeDetails = createAsyncThunk(
    'office/getOfficeDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`profile/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const indexRequest = createAsyncThunk(
    'office/indexSent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('office/indexSent');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendRequest = createAsyncThunk(
    'office/sendRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('office/send-request', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const deleteRequest = createAsyncThunk(
    'office/deleteRequest',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`office/delete-request/${id}`);  
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const { actions: officeActions } = officeSlice;
export const officeReducer = officeSlice.reducer;