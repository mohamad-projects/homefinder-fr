// src/features/services/servicesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// جلب أنواع الخدمات
export const getAllServiceTypes = createAsyncThunk(
  'services/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services/servicesType/');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// جلب معلومات الخدمة حسب النوع
export const getServiceInfoById = createAsyncThunk(
  'services/getInfoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/servicesType/${id}`);
      return { id, data: response.data.data.services_info };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ جلب الخدمات الخاصة بالمكتب (البروفايل)
export const getOfficeServices = createAsyncThunk(
  'services/getOfficeServices',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/office/${id}`);
      return response.data.data.service || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ حذف خدمة بواسطة ID
export const deleteServiceById = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/services/delete/${id}`);
      return id; // نرجع ID فقط لحذفه من الواجهة
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    loading: false,
    error: null,
    services: [],
    selectedServiceId: null,
    selectedServiceInfo: [],
  },
  reducers: {
    setSelectedServiceId: (state, action) => {
      state.selectedServiceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all service types
      .addCase(getAllServiceTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getAllServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get service info by ID
      .addCase(getServiceInfoById.fulfilled, (state, action) => {
        state.selectedServiceInfo = action.payload.data;
      })

      // ✅ Get office services
      .addCase(getOfficeServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfficeServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getOfficeServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete service
      .addCase(deleteServiceById.fulfilled, (state, action) => {
        const id = action.payload;
        state.services = state.services.filter(service => service.id !== id);
      });
  },
});

export const { setSelectedServiceId } = servicesSlice.actions;
export const servicesReducer = servicesSlice.reducer;
