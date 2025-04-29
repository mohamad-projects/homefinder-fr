// // authService.js
// import { setCredentials, setLoading, setError, logout } from './authSlice';
// import api from '../../services/api';

// // Helper function remains but no longer needs the login thunk
// const dispatchAuthActions = (dispatch, action, payload) => {
//     switch (action) {
//         case 'login/pending':
//             dispatch(setLoading(true));
//             dispatch(setError(null));
//             break;
//         case 'login/fulfilled':
//             dispatch(setCredentials(payload));
//             dispatch(setLoading(false));
//             break;
//         case 'login/rejected':
//             dispatch(setError(payload));
//             dispatch(setLoading(false));
//             break;
//         default:
//             break;
//     }
// };

// // Remove the login thunk from here
// // Keep other auth-related functions if needed