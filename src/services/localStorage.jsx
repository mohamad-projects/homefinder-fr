export const getItem = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        console.error('Error getting item from localStorage', error);
        return null;
    }
};

export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting item in localStorage', error);
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from localStorage', error);
    }
};