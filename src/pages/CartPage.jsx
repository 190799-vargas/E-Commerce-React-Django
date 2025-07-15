// src/pages/CartPage.jsx
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext'; // Para proteger la ruta y manejar el logout si el token expira
import orderService from '../services/orderService';

const CartPage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItem, setUpdatingItem] = useState(null); // Para saber qué ítem se está actualizando (cargando)
    const [removingItem, setRemovingItem] = useState(null); // Para saber qué ítem se está eliminando (cargando)


    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
        toast.info('Por favor, inicia sesión para ver tu carrito.');
        navigate('/login');
        }
    }, [isAuthenticated, navigate]);


    // Función para formatear el precio a moneda
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };


    // Cargar el carrito al montar el componente
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getCart();
            setCart(data);
        } catch (err) {
            if (err.detail === 'Las credenciales de autenticación no se proveyeron.' || err.code === 'token_not_valid') {
                logout(); // Si el token expiró o no es válido, desloguear
                toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            } else {
                setError('Error al cargar el carrito. Por favor, inténtalo de nuevo.');
            }
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, logout]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    // Manejar el cambio de cantidad de un ítem
    const handleQuantityChange = async (itemId, newQuantity, productStock) => {
        // Validación básica en el cliente
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > productStock) newQuantity = productStock;

        // Si la cantidad no cambia, no hacer nada
        const currentItem = cart.items.find(item => item.id === itemId);
        if (currentItem && currentItem.quantity === newQuantity) {
            return;
        }

        setUpdatingItem(itemId);
        try {
            const updatedItem = await orderService.updateCartItem(itemId, newQuantity);
            // Actualizar el estado del carrito localmente con el ítem modificado
            setCart(prevCart => {
                const updatedItems = prevCart.items.map(item =>
                item.id === itemId ? updatedItem : item
                );
                // Recalcular totales (tu backend ya debería devolver los totales actualizados, pero por si acaso)
                const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
                return { ...prevCart, items: updatedItems, total_items: newTotalItems, total_amount: newTotalAmount };
            });
            toast.success('Cantidad actualizada.');
        } catch (err) {
            toast.error('Error al actualizar la cantidad.');
            console.error('Error updating cart item:', err);
            // Opcional: Volver a cargar el carrito completo si la actualización falla para asegurar la consistencia
            fetchCart();
        } finally {
            setUpdatingItem(null);
        }
    };

    // Manejar la eliminación de un ítem
    const handleRemoveItem = async (itemId, productName) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${productName}" del carrito?`)) {
        setRemovingItem(itemId);
        try {
            await orderService.removeCartItem(itemId);
            // Actualizar el estado del carrito localmente
            setCart(prevCart => {
            const filteredItems = prevCart.items.filter(item => item.id !== itemId);
            const newTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalAmount = filteredItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
            return { ...prevCart, items: filteredItems, total_items: newTotalItems, total_amount: newTotalAmount };
            });
            toast.success(`"${productName}" eliminado del carrito.`);
        } catch (err) {
            toast.error('Error al eliminar el producto del carrito.');
            console.error('Error removing cart item:', err);
            fetchCart(); // Recargar por seguridad
        } finally {
            setRemovingItem(null);
        }
        }
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout'); // Navega a la página de checkout (que crearemos después)
    };


    if (loading) {
        return (
        <Container className="text-center my-5">
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando carrito...</span>
            </Spinner>
        </Container>
        );
    }

    if (error) {
        return (
        <Container className="my-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
        <Container className="text-center my-5">
            <ShoppingCart size={80} className="mb-3 text-muted" />
            <h2>Tu carrito está vacío</h2>
            <p>Parece que no has añadido nada a tu carrito de compras.</p>
            <Button as={Link} to="/productos" variant="primary">Explorar Productos</Button>
        </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4">Tu Carrito de Compras</h1>
            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Table responsive hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="align-middle">
                                                <div className="d-flex align-items-center">
                                                <Link to={`/producto/${item.product_slug}`}>
                                                    <img
                                                    src={item.product_image || 'https://via.placeholder.com/50'}
                                                    alt={item.product_title}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                                                    />
                                                </Link>
                                                <div>
                                                    <Link to={`/producto/${item.product_slug}`} className="text-decoration-none text-dark fw-bold">
                                                    {item.product_title}
                                                    </Link>
                                                    <p className="mb-0 text-muted small">Vendedor: {item.seller_username}</p>
                                                </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">{formatPrice(item.product_price)}</td>
                                            <td className="align-middle">
                                                <InputGroup style={{ width: '130px' }}>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product_stock)}
                                                    disabled={item.quantity <= 1 || updatingItem === item.id}
                                                >
                                                    <MinusCircle size={18} />
                                                </Button>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value), item.product_stock)}
                                                    className="text-center"
                                                    min="1"
                                                    max={item.product_stock}
                                                    disabled={updatingItem === item.id}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product_stock)}
                                                    disabled={item.quantity >= item.product_stock || updatingItem === item.id}
                                                >
                                                    <PlusCircle size={18} />
                                                </Button>
                                                {updatingItem === item.id && <Spinner animation="border" size="sm" className="ms-2" />}
                                                </InputGroup>
                                                {item.quantity > item.product_stock && (
                                                    <span className="text-danger small d-block mt-1">Stock insuficiente</span>
                                                )}
                                                {item.product_stock === 0 && (
                                                    <span className="text-danger small d-block mt-1">Sin stock</span>
                                                )}
                                                {item.quantity <= item.product_stock && item.quantity > 0 && item.product_stock > 0 && (
                                                    <span className="text-muted small d-block mt-1">{item.product_stock} en stock</span>
                                                )}
                                            </td>
                                            <td className="align-middle fw-bold">{formatPrice(item.total_price)}</td>
                                            <td className="align-middle text-end">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.id, item.product_title)}
                                                    disabled={removingItem === item.id}
                                                    >
                                                    {removingItem === item.id ? <Spinner animation="border" size="sm" /> : <Trash2 size={18} />}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Resumen del Carrito */}
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">Resumen de la Compra</Card.Title>
                            <ul className="list-unstyled">
                                <li className="d-flex justify-content-between mb-2">
                                    <span>Productos ({cart.total_items} ítems)</span>
                                    <span>{formatPrice(cart.total_amount)}</span>
                                </li>
                                {/* Puedes añadir más conceptos como envío, impuestos, descuentos, etc. */}
                                <li className="d-flex justify-content-between mb-3 fw-bold fs-5 border-top pt-3">
                                    <span>Total</span>
                                    <span>{formatPrice(cart.total_amount)}</span>
                                </li>
                            </ul>
                            <div className="d-grid gap-2">
                                <Button variant="success" size="lg" onClick={handleProceedToCheckout}>
                                    Continuar Compra
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;