/**
 * Función para formatear un precio a la moneda local (COP en este caso).
 * @param {number} price - El precio numérico.
 * @returns {string} El precio formateado como cadena de moneda.
 */
export const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP', // Cambia a tu moneda local si es diferente
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

/**
 * Valida un correo electrónico simple.
 * @param {string} email - Correo a validar.
 * @returns {boolean} True si es válido, false en caso contrario.
 */
export const isValidEmail = (email) => {
    // Regex simple para validación de email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Valida una URL simple.
 * @param {string} url - URL a validar.
 * @returns {boolean} True si es válida, false en caso contrario.
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};