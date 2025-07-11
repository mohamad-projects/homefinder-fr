import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    complaints: [],  // Fixed typo and better naming (plural for array)
    loading: false,  // Changed from null to boolean
    error: null,
};

const complaintSlice = createSlice({
    name: 'complaint',
    initialState,
    reducers: {
        // You can add synchronous actions here if needed
    },
    extraReducers: (builder) => {
        builder
            // Create Complaint
            .addCase(createComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints.push(action.payload);
            })
            .addCase(createComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete Complaint
            .addCase(deleteComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = state.complaints.filter(
                    complaint => complaint.id !== action.payload
                );
            })
            .addCase(deleteComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Get Complaint
            .addCase(getComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = action.payload;
            })
            .addCase(getComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Action Creators
export const createComplaint = createAsyncThunk(
    'complaint/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('complaint/create', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteComplaint = createAsyncThunk(  // Consistent lowercase naming
    'complaint/delete',  // Fixed typo
    async (id, { rejectWithValue }) => {  // Simplified parameter
        try {
            await api.delete(`complaint/delete/${id}`);  
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getComplaints = createAsyncThunk( 
    'complaint/getAll',
    async (_, { rejectWithValue }) => {  
        try {
            const response = await api.get('complaint/');  // GET method
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const { actions: complaintActions } = complaintSlice;
export const complaintReducer = complaintSlice.reducer;