import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
     mode: 'cors',
});


api.interceptors.request.use(
    (config) => {
        try {
            const token = store.getState()?.auth?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;