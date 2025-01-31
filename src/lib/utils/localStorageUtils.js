// Utility Functions for Local Storage

export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving to localStorage: ${error}`);
    }
};

export const getFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        try {
            if (serializedValue === null) return null;
            return JSON.parse(serializedValue);
        } catch (e) {
            console.error("Error parsing JSON from localStorage:", e);
            return serializedValue;  // Return original value if parsing fails
        }
    } catch (error) {
        console.error(`Error getting data from localStorage: ${error}`);
        return null;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing data from localStorage: ${error}`);
    }
};

export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error(`Error clearing localStorage: ${error}`);
    }
};