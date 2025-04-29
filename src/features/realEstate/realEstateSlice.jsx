import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    realEstate: [],
    loading: null,
    error: null,
}
const realEstate = createSlice({
    name: "realEstate",
    initialState,

    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(AddRealEstate.pending, (state) => {
                state.loading = true
                state.false = true
            })
            .addCase(AddRealEstate.fulfilled, (state, action) => {
                state.realEstate = [
                    ...state.realEstate,
                    action.payload
                ];
                state.loading = false;
                state.error = false;
            })
            .addCase(AddRealEstate.rejected, (state) => {
                state.loading = false
                state.false = true
            })
    }
})

export const AddRealEstate = createAsyncThunk(
    'realEstate\Add',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/Add', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const realEstateReducer = realEstate.reducer;