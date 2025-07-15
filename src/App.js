// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importa los contextos
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Asegúrate de que useAuth esté disponible desde aquí
import { CartProvider } from './contexts/CartContext';

// Importa los componentes de diseño
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

// Importa la definición de rutas
import { routes } from './routes'; // Importar el array de rutas

// Componente auxiliar para rutas protegidas
// Este componente verifica si el usuario está autenticado
// y redirige a la página de login si no lo está.
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth(); // Asume que useAuth proporciona isAuthenticated y loading
    const location = useLocation();

    // Puedes mostrar un spinner o un estado de carga si la autenticación está en progreso
    if (loading) {
        return null; // O un <LoadingSpinner /> si tienes uno
    }

    if (!isAuthenticated) {
        // Redirige al usuario a la página de login, guardando la ubicación actual
        // para que pueda ser redirigido de vuelta después de iniciar sesión.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            {/* Envuelve toda la aplicación con AuthProvider y CartProvider */}
            <AuthProvider>
                <CartProvider>
                    <Header />
                    <main className="container my-4">
                        <Routes>
                            {/* Mapea las rutas desde el array importado */}
                            {routes.map((route, index) => (
                                <Route
                                    key={index} // Se usa el índice como clave, considera usar algo más estable si las rutas cambian dinámicamente
                                    path={route.path}
                                    element={
                                        // Si la ruta está marcada como protegida, envuélvela en ProtectedRoute
                                        route.protected ? (
                                            <ProtectedRoute>
                                                {/* React.createElement se usa para instanciar el componente dinámicamente */}
                                                {React.createElement(route.element)}
                                            </ProtectedRoute>
                                        ) : (
                                            // Para rutas no protegidas, renderiza el componente directamente
                                            React.createElement(route.element)
                                        )
                                    }
                                />
                            ))}
                        </Routes>
                    </main>
                    <Footer />
                    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;