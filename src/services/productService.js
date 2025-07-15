// src/services/productService.js
import axios from 'axios';

// URL base de tu API de Django para productos y categorías
const API_BASE_URL = 'http://127.0.0.1:8000/api/'; // Ajusta esta URL si tu API está en otro lugar

// Configuración de Axios para incluir el token de autenticación (si es necesario para alguna ruta, aunque la mayoría de productos son públicos)
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a todas las peticiones (si tienes rutas de productos/categorías protegidas)
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Funciones para Productos ---

/**
 * Obtiene una lista de productos.
 * @param {object} params - Parámetros de filtro, búsqueda y paginación.
 * @returns {Promise<Array>} Lista de productos.
 */
const getProducts = async (params = {}) => {
    try {
        // Construir la URL con los parámetros de búsqueda, filtro y ordenamiento
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`products/?${queryString}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene los detalles de un producto específico por su slug.
 * @param {string} slug - El slug del producto.
 * @returns {Promise<object>} Detalles del producto.
 */
const getProductDetail = async (slug) => {
    try {
        const response = await api.get(`products/${slug}/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalle del producto ${slug}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Realiza una búsqueda de productos.
 * @param {string} query - El término de búsqueda.
 * @returns {Promise<Array>} Lista de productos que coinciden con la búsqueda.
 */
const searchProducts = async (query) => {
    try {
        const response = await api.get(`products/search/?q=${query}`);
        return response.data;
    } catch (error) {
        console.error(`Error al buscar productos con "${query}":`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene una lista de productos por categoría.
 * @param {string} categorySlug - El slug de la categoría.
 * @param {object} params - Parámetros de filtro y paginación.
 * @returns {Promise<object>} Objeto con lista de productos, total de páginas, etc.
 */
const getProductsByCategory = async (categorySlug, params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        // Nota: Asumo que tu endpoint maneja paginación y filtros para esta ruta también
        const response = await api.get(`products/category/${categorySlug}/?${queryString}`);
        return response.data; // Tu backend debería devolver algo como { results: [...], total_pages: X, current_page: Y }
    } catch (error) {
        console.error(`Error al obtener productos por categoría ${categorySlug}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene una lista de productos destacados.
 * @returns {Promise<Array>} Lista de productos destacados.
 */
const getFeaturedProducts = async () => {
    try {
        const response = await api.get('products/featured/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos destacados:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Publica una reseña para un producto.
 * @param {number} productId - ID del producto.
 * @param {object} reviewData - Datos de la reseña (rating, comment).
 * @returns {Promise<object>} La reseña creada.
 */
const submitProductReview = async (productId, reviewData) => {
    try {
        const response = await api.post(`products/${productId}/reviews/`, reviewData);
        return response.data;
    } catch (error) {
        console.error(`Error al enviar reseña para producto ${productId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


// --- Funciones para Categorías (también útiles aquí) ---

/**
 * Obtiene el árbol completo de categorías.
 * @returns {Promise<Array>} Árbol de categorías anidadas.
 */
const getCategoryTree = async () => {
    try {
        const response = await api.get('categories/tree/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener el árbol de categorías:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene las categorías más populares.
 * @returns {Promise<Array>} Lista de categorías populares.
 */
const getPopularCategories = async () => {
    try {
        const response = await api.get('categories/popular/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías populares:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


const productService = {
    getProducts,
    getProductDetail,
    searchProducts,
    getProductsByCategory, // <--- Método Añadido
    getFeaturedProducts, // <--- Método Añadido (para HomePage)
    submitProductReview,
    getCategoryTree, // Puedes mantenerlo aquí o en categoryService, pero dado que ya lo tenías, lo dejo.
    getPopularCategories, // Puedes mantenerlo aquí o en categoryService, pero dado que ya lo tenías, lo dejo.
};

export default productService;