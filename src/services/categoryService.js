// src/services/categoryService.js
import axios from 'axios';

// URL base de tu API de Django para categorías
const API_BASE_URL = 'http://127.0.0.1:8000/api/categories/'; // Ajusta esta URL si tu API está en otro lugar

const api = axios.create({
    baseURL: API_BASE_URL,
});

// --- Funciones para Categorías ---

/**
 * Obtiene el árbol completo de categorías, ideal para menús de navegación.
 * @returns {Promise<Array>} Un array de objetos de categoría.
 */
const getCategoryTree = async () => {
    try {
        const response = await api.get('tree/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener el árbol de categorías:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene las categorías más populares (ej. para la página de inicio).
 * @returns {Promise<Array>} Un array de objetos de categoría.
 */
const getPopularCategories = async () => {
    try {
        const response = await api.get('popular/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías populares:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene los detalles de una categoría específica por su slug.
 * @param {string} slug - El slug de la categoría.
 * @returns {Promise<object>} Los detalles de la categoría.
 */
const getCategoryDetail = async (slug) => {
    try {
        const response = await api.get(`${slug}/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el detalle de la categoría con slug "${slug}":`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

const categoryService = {
    getCategoryTree,
    getPopularCategories,
    getCategoryDetail,
};

export default categoryService;