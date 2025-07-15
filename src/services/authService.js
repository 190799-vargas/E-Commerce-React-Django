import axios from "axios";

// URL base de tu API de Django
const API_URL = 'http://127.0.0.1:8000/api/auth/'; // Ajusta esta URL si tu API está en otro lugar

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register/`, userData);
        // El backend ya devuelve el user, refresh y access token
        return response.data;
    } catch (error) {
        // Si la respuesta es de un error del backend, usa el mensaje de error del backend
        if (error.response && error.response.data) {
        throw error.response.data; // Esto capturará los errores de validación de Django
        }
        throw error; // Para otros errores de red, etc.
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}login/`, credentials);
        // El backend ya devuelve el user, refresh y access token
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
        throw error.response.data; // Esto capturará los errores de credenciales inválidas, etc.
        }
        throw error;
    }
};

// Función para refrescar el token
const refreshToken = async (refresh) => {
    try {
        const response = await axios.post(`${API_URL}token/refresh/`, { refresh });
        return response.data.access; // Solo nos interesa el nuevo access token
    } catch (error) {
        if (error.response && error.response.data) {
        throw error.response.data;
        }
        throw error;
    }
};

const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}profile/`); // Endpoint GET para el perfil
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
        throw error.response.data;
        }
        throw error;
    }
};

// Actualizar Perfil del Usuario ---
const updateProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}profile/`, profileData); // Endpoint PUT para actualizar el perfil
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
        throw error.response.data;
        }
        throw error;
    }
};

const authService = {
    register,
    login,
    refreshToken,
    updateProfile,
    getUserProfile,
};

export default authService;

