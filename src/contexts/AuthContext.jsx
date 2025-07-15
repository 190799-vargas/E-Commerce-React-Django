import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Creamos el contexto
const AuthContext = createContext(null);


// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null); // Almacena el access token
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Función para guardar los tokens en localStorage y establecer el estado
    const setTokens = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setAuthToken(accessToken); // Guardamos solo el access token en el estado, el refresh es para renovar
        try {
            const decodedUser = jwtDecode(accessToken);
            setUser(decodedUser); // El token debería contener la información básica del usuario
        } catch (error) {
            console.error("Error decodificando el token de acceso:", error);
            setUser(null); // En caso de token inválido, limpiar el usuario
        }
    };

    useEffect(() => {
        const loadUser = async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken) {
            try {
            const decodedUser = jwtDecode(accessToken);
            // Opcional: validar si el token no ha expirado o intentar refrescarlo
            // Por ahora, asumimos que si existe, es válido hasta que una petición falle.
            setUser(decodedUser);
            setAuthToken(accessToken);
            } catch (error) {
            console.error("Token de acceso inválido o expirado. Intentando refrescar...", error);
            // Aquí podríamos intentar refrescar el token si el error es de expiración
            // Por ahora, lo dejamos simple y limpiaremos el estado.
            logout();
            }
        }
        setLoading(false);
        };

        loadUser();
    }, []); // Se ejecuta una sola vez al montar el componente

    // Función de login
    const login = async (accessToken, refreshToken, userData) => {
        setTokens(accessToken, refreshToken);
        setUser(userData); // El backend ya nos da la info del usuario
        navigate('/'); // Redirigir a la página de inicio o dashboard
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setAuthToken(null);
        navigate('/login'); // Redirigir a la página de login
    };

    // El valor que proveerá el contexto
    const contextData = {
        user,
        authToken,
        isAuthenticated: !!user,
        login,
        logout,
        setTokens, // Para usarlo directamente si la respuesta del API ya da los tokens
        loading,
    };

    // Muestra un spinner de carga mientras se verifica la autenticación inicial
    if (loading) {
        return <div>Cargando autenticación...</div>; // Podrías usar un componente LoadingSpinner de Bootstrap aquí
    }

    return (
        <AuthContext.Provider value={contextData}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook para usar el contexto de autenticación con validación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
};


