// src/routes.js
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';

// Puedes definir las rutas aquí para importarlas en App.js
export const routes = [
    { path: '/', element: HomePage, name: 'Home', exact: true },
    { path: '/productos', element: ProductsPage, name: 'Products' },
    { path: '/producto/:slug', element: ProductDetailPage, name: 'ProductDetail' },
    { path: '/categorias/:categorySlug', element: CategoryPage, name: 'Category' },
    { path: '/login', element: LoginPage, name: 'Login' },
    { path: '/registro', element: RegisterPage, name: 'Register' },
    { path: '/perfil', element: UserProfilePage, name: 'UserProfile', protected: true },
    { path: '/carrito', element: CartPage, name: 'Cart', protected: true },
    { path: '/checkout', element: CheckoutPage, name: 'Checkout', protected: true },
    { path: '/mis-ordenes', element: OrderHistoryPage, name: 'OrderHistory', protected: true },
    { path: '/mis-ordenes/:orderNumber', element: OrderDetailPage, name: 'OrderDetail', protected: true },
];

// Opcionalmente, puedes usar este archivo para crear un Router.
// Para mantener la simplicidad, seguiremos usando App.js para la configuración del Router.