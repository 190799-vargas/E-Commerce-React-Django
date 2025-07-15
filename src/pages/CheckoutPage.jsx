// src/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext'; // Para proteger la ruta
import authService from '../services/authService'; // Para obtener la dirección del perfil
import orderService from '../services/orderService';

const CheckoutPage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true); // Para cargar el perfil del usuario
    const [error, setError] = useState(null);
    const [submittingOrder, setSubmittingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Estado para los datos de la orden (dirección de envío, etc.)
    const [orderData, setOrderData] = useState({
        shipping_address: '',
        city: '',
        country: '',
        phone: '',
        // Puedes añadir más campos como método de pago (si tu backend lo soporta)
    });

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Por favor, inicia sesión para proceder con la compra.');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Cargar carrito y datos del perfil del usuario al montar
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;

            // Cargar carrito
            setLoadingCart(true);
            try {
                const cartData = await orderService.getCart();
                if (cartData.items.length === 0) {
                    toast.info('Tu carrito está vacío. Añade productos antes de proceder al checkout.');
                    navigate('/carrito'); // Redirigir al carrito si está vacío
                    return;
                }
                setCart(cartData);
            } catch (err) {
                if (err.detail === 'Las credenciales de autenticación no se proveyon.' || err.code === 'token_not_valid') {
                logout();
                toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                } else {
                setError('Error al cargar el carrito.');
                }
                console.error('Error fetching cart for checkout:', err);
            } finally {
                setLoadingCart(false);
            }

            // Cargar datos del perfil para prellenar la dirección
            setLoadingProfile(true);
            try {
                const profileData = await authService.getUserProfile();
                setOrderData(prev => ({
                    ...prev,
                    shipping_address: profileData.address || '',
                    city: profileData.city || '',
                    country: profileData.country || '',
                    phone: profileData.phone || '',
                }));
            } catch (err) {
                console.error('Error fetching user profile for pre-filling address:', err);
                // No bloquear el checkout si el perfil no se carga, solo no prellenar
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate, logout]);


    // Manejar cambios en el formulario de dirección
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    // Función para formatear el precio a moneda
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };


    // Manejar el envío del formulario de la orden
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setSubmittingOrder(true);
        setOrderError(null);

        // Validaciones básicas
        if (!orderData.shipping_address || !orderData.city || !orderData.country || !orderData.phone) {
            setOrderError('Por favor, completa todos los campos de dirección de envío.');
            setSubmittingOrder(false);
            return;
        }

        try {
            const order = await orderService.createOrder(orderData);
            toast.success(`Orden ${order.order_number} creada exitosamente!`);
            navigate(`/mis-ordenes/${order.order_number}`); // Redirigir a la página de detalle de la orden
        } catch (err) {
            if (err) {
                let errorMessages = [];
                for (const key in err) {
                    if (Array.isArray(err[key])) {
                        err[key].forEach(msg => errorMessages.push(`${key}: ${msg}`));
                    } else {
                        errorMessages.push(`${key}: ${err[key]}`);
                    }
                }
                setOrderError(errorMessages.join(' | '));
            } else {
                setOrderError('Error desconocido al crear la orden.');
            }
            console.error('Error creating order:', err);
        } finally {
        setSubmittingOrder(false);
        }
    };

    if (loadingCart || loadingProfile) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando datos para el checkout...</span>
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

    // Si el carrito se cargó pero está vacío (y no fue redirigido antes)
    if (!cart || cart.items.length === 0) {
        return (
            <Container className="text-center my-5">
                <h2>Tu carrito está vacío</h2>
                <p>No hay productos para proceder con la compra.</p>
                <Button as={Link} to="/productos" variant="primary">Explorar Productos</Button>
            </Container>
        );
    }


    return (
        <Container className="my-5">
            <h1 className="mb-4 text-center">Finalizar Compra</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    {orderError && <Alert variant="danger">{orderError}</Alert>}
                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">1. Dirección de Envío</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmitOrder}>
                                <Form.Group className="mb-3" controlId="shippingAddress">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shipping_address"
                                        value={orderData.shipping_address}
                                        onChange={handleChange}
                                        placeholder="Ej: Calle 123 #45-67"
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="city">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                value={orderData.city}
                                                onChange={handleChange}
                                                placeholder="Ej: Bogotá"
                                                required
                                        />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="country">
                                            <Form.Label>País</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="country"
                                                value={orderData.country}
                                                onChange={handleChange}
                                                placeholder="Ej: Colombia"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>Teléfono de Contacto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={orderData.phone}
                                        onChange={handleChange}
                                        placeholder="Ej: +57 300 123 4567"
                                        required
                                    />
                                </Form.Group>
                            </Form> {/* Cierre temprano del formulario para envolver las secciones, se enviará con el botón final */}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">2. Resumen del Pedido</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {cart.items.map(item => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={item.product_image || 'https://via.placeholder.com/40'}
                                            alt={item.product_title}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '15px' }}
                                        />
                                        <div>
                                            {item.product_title}
                                            <span className="text-muted small d-block"> x {item.quantity}</span>
                                        </div>
                                    </div>
                                    <span>{formatPrice(item.total_price)}</span>
                                </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total a Pagar</span>
                                <span>{formatPrice(cart.total_amount)}</span>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">3. Método de Pago</Card.Header>
                        <Card.Body>
                            <Alert variant="info" className="text-center">
                                La implementación real de pasarelas de pago se realizaría aquí.
                                Por ahora, al confirmar, la orden se creará en tu sistema.
                            </Alert>
                            {/* Aquí irían los radios para seleccionar tarjeta, PSE, etc. */}
                        </Card.Body>
                    </Card>

                    <Button
                        variant="success"
                        size="lg"
                        className="w-100"
                        onClick={handleSubmitOrder} // Se enlaza al formulario completo
                        disabled={submittingOrder || !cart || cart.items.length === 0}
                    >
                        {submittingOrder ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {' '}Confirmando Compra...
                        </>
                        ) : (
                        'Confirmar Compra'
                        )}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;