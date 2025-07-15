// src/pages/OrderDetailPage.jsx
import { MapPin, Package, Phone } from 'lucide-react'; // Iconos
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';

const OrderDetailPage = () => {
    const { orderNumber } = useParams(); // Obtiene el número de orden de la URL
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Por favor, inicia sesión para ver los detalles de tu orden.');
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

    // Cargar los detalles de la orden
    const fetchOrderDetail = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderDetail(orderNumber);
            setOrder(data);
        } catch (err) {
            if (err.detail === 'Las credenciales de autenticación no se proveyeron.' || err.code === 'token_not_valid') {
                logout();
                toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            } else if (err.detail === 'No encontrado.') { // Si el backend responde 404
                setError('La orden solicitada no fue encontrada o no te pertenece.');
            }
            else {
                setError('Error al cargar los detalles de la orden. Por favor, inténtalo de nuevo.');
            }
            console.error('Error fetching order detail:', err);
        } finally {
        setLoading(false);
        }
    }, [isAuthenticated, orderNumber, logout]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);


    if (loading) {
        return (
        <Container className="text-center my-5">
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando detalles de la orden...</span>
            </Spinner>
        </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
                <Button as={Link} to="/mis-ordenes" variant="secondary" className="mt-3">Volver al Historial</Button>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container className="my-5">
                <Alert variant="info">Detalles de la orden no disponibles.</Alert>
                <Button as={Link} to="/mis-ordenes" variant="secondary" className="mt-3">Volver al Historial</Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 text-center">Detalles de la Orden #{order.order_number}</h1>
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p className="mb-1"><strong>Fecha de Orden:</strong> {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        <p className="mb-1"><strong>Estado:</strong>
                                            <span className={`badge bg-${
                                                order.status === 'pending' ? 'warning' :
                                                order.status === 'processing' ? 'info' :
                                                order.status === 'shipped' ? 'primary' :
                                                order.status === 'delivered' ? 'success' :
                                                'secondary'
                                            } ms-2`}>
                                            {order.status_display || order.status}
                                            </span>
                                        </p>
                                    <p className="mb-1"><strong>Total:</strong> {formatPrice(order.total_amount)}</p>
                                </Col>
                                <Col md={6}>
                                    <h5 className="mt-3 mt-md-0">
                                        <MapPin size={20} className="me-2 text-muted" /> Dirección de Envío
                                    </h5>
                                    <p className="mb-1">{order.shipping_address}</p>
                                    <p className="mb-1">{order.city}, {order.country}</p>
                                    <p className="mb-0"><Phone size={16} className="me-1 text-muted" /> {order.phone}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">Productos en la Orden</Card.Header>
                        <Card.Body>
                            <Table responsive striped hover className="mb-0">
                                <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="align-middle">
                                                <div className="d-flex align-items-center">
                                                    <Link to={`/producto/${item.product_slug}`}>
                                                        <img
                                                        src={item.product_image || 'https://via.placeholder.com/50'}
                                                        alt={item.product_title}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                                                        />
                                                    </Link>
                                                    <Link to={`/producto/${item.product_slug}`} className="text-decoration-none text-dark fw-bold">
                                                        {item.product_title}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="align-middle">{item.quantity}</td>
                                            <td className="align-middle">{formatPrice(item.price)}</td>
                                            <td className="align-middle fw-bold">{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <div className="text-center mt-4">
                        <Button as={Link} to="/mis-ordenes" variant="secondary" className="me-3">
                            <Package size={20} className="me-2" /> Volver a Mis Órdenes
                        </Button>
                        {/* Puedes añadir más acciones aquí, como "Contactar al vendedor" */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderDetailPage;