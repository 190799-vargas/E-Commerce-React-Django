import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import orderService from "../services/orderService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(false);

    // Función para obtener el carrito del backend
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
            return;
        }
        setLoadingCart(true);
        try {
            const data = await orderService.getCart();
            setCart(data);
        } catch (error) {
            console.error("Error fetching cart in context:", error);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Función para agregar un producto al carrito
    const addToCart = async (ProductId, quantity = 1) => {
        if (!isAuthenticated) {
            toast.info('Por favor, inicia sesión para agregar productos al carrito.');
            return;
        }

        try {
            // Se interactua con la API
            const updatedCartItem = await orderService.addToCart(ProductId, quantity);

            // Actualizar el estado del carrito localmente
            setCart(prevCart => {
                // Clonar el carrito existente si hay uno, o inicializarlo
                let newCart = prevCart ? { ...prevCart } : { items: [], total_items: 0, total_amount: 0 };

                // Verificar si el ítem ya está en el carrito
                const existingItemIndex = newCart.items.findIndex(item => item.product_id === updatedCartItem.product_id);

                if (existingItemIndex > -1) {
                    // Si existe, actualizarlo con los datos que devuelve el backend
                    newCart.items[existingItemIndex] = updatedCartItem;
                } else {
                    // Si no existe, agregarlo
                    newCart.items.push(updatedCartItem);
                }

                // Recalcular totales (idealmente el backend ya los devuelve actualizados)
                newCart.total_items = newCart.items.reduce((sum, item) => sum + item.quantity, 0);
                newCart.total_amount = newCart.items.reduce((sum, item) => sum + item.total_price, 0);

                return newCart;
            });

            toast.success('Producto añadido al carrito.');
            return updatedCartItem;
        } catch (error) {
            toast.error('Error al añadir el producto al carrito.');
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    // Función para vaciar el carrito (útil después de un checkout exitoso)
    const clearCart = () => {
        setCart(null);
    };

    const value = {
        cart,
        loadingCart,
        addToCart,
        fetchCart, // Permite recargar el carrito desde otros componentes (ej. CartPage)
        clearCart,
        // Puedes añadir funciones para actualizar/eliminar aquí también, aunque CartPage ya lo hace.
    };

    return (
        <CartContext.Provider value={value}>
        {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser utilizado dentro de un CartProvider');
    }
    return context;
};