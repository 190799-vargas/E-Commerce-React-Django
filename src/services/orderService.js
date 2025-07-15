// src/services/orderService.js
import axios from 'axios';

// URL base de tu API de Django para órdenes y carrito
const API_BASE_URL = 'http://127.0.0.1:8000/api/orders/'; // Ajusta esta URL si tu API está en otro lugar

// Configuración de Axios para incluir el token de autenticación
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Aquí puedes manejar errores de token expirado, etc.
        // Por ahora, simplemente lo rechazamos.
        return Promise.reject(error);
    }
);

// --- Funciones para el Carrito ---

/**
 * Obtiene los detalles del carrito del usuario actual.
 * @returns {Promise<object>} Objeto del carrito con sus ítems.
 */
const getCart = async () => {
    try {
        const response = await api.get('cart/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener el carrito:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Agrega un producto al carrito o actualiza su cantidad si ya existe.
 * @param {number} productId - ID del producto.
 * @param {number} quantity - Cantidad a agregar.
 * @returns {Promise<object>} El ítem del carrito actualizado o creado.
 */
const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('cart/add/', { product_id: productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error al agregar/actualizar producto en el carrito:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Actualiza la cantidad de un ítem específico en el carrito.
 * @param {number} itemId - ID del ítem del carrito (CartItem).
 * @param {number} quantity - Nueva cantidad.
 * @returns {Promise<object>} El ítem del carrito actualizado.
 */
const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`cart/${itemId}/`, { quantity });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar ítem ${itemId} en el carrito:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Elimina un ítem específico del carrito.
 * @param {number} itemId - ID del ítem del carrito (CartItem).
 * @returns {Promise<object>} Mensaje de éxito.
 */
const removeCartItem = async (itemId) => {
    try {
        const response = await api.delete(`cart/items/${itemId}remove/`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar ítem ${itemId} del carrito:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// --- Funciones para Órdenes ---

/**
 * Crea una nueva orden a partir del carrito actual del usuario.
 * @param {object} orderData - Datos adicionales de la orden (ej. dirección de envío).
 * @returns {Promise<object>} La orden creada.
 */
const createOrder = async (orderData) => {
    try {
        const response = await api.post('create/', orderData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la orden:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene el historial de órdenes del usuario actual.
 * @returns {Promise<Array>} Lista de órdenes del usuario.
 */
const getMyOrders = async () => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        console.error("Error al obtener mis órdenes:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Obtiene los detalles de una orden específica por su número de orden.
 * @param {string} orderNumber - El número de la orden.
 * @returns {Promise<object>} Detalles de la orden.
 */
const getOrderDetail = async (orderNumber) => {
    try {
        const response = await api.get(`${orderNumber}/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalle de la orden ${orderNumber}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


const orderService = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
    getMyOrders,
    getOrderDetail,
};

export default orderService;