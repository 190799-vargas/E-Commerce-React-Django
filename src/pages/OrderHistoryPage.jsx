// src/pages/OrderHistoryPage.jsx
import { Package } from 'lucide-react'; // Icono para las órdenes
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext'; // Para proteger la ruta y manejar el logout si el token expira
import orderService from '../services/orderService';

const OrderHistoryPage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
        toast.info('Por favor, inicia sesión para ver tu historial de órdenes.');
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

    // Cargar el historial de órdenes
    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
        const data = await orderService.getMyOrders();
        setOrders(data);
        } catch (err) {
        if (err.detail === 'Las credenciales de autenticación no se proveyeron.' || err.code === 'token_not_valid') {
            logout(); // Si el token expiró o no es válido, desloguear
            toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        } else {
            setError('Error al cargar tu historial de órdenes. Por favor, inténtalo de nuevo.');
        }
        console.error('Error fetching order history:', err);
        } finally {
        setLoading(false);
        }
    }, [isAuthenticated, logout]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando historial de órdenes...</span>
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

    if (orders.length === 0) {
        return (
            <Container className="text-center my-5">
                <Package size={80} className="mb-3 text-muted" />
                <h2>Aún no has realizado ninguna compra</h2>
                <p>Cuando hagas tu primera compra, aparecerá aquí.</p>
                <Button as={Link} to="/productos" variant="primary">Explorar Productos</Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 text-center">Mi Historial de Órdenes</h1>
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Table responsive striped hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Número de Orden</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.order_number}>
                                            <td className="align-middle fw-bold">{order.order_number}</td>
                                            <td className="align-middle">{new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="align-middle">
                                                <span className={`badge bg-${
                                                    order.status === 'pending' ? 'warning' :
                                                    order.status === 'processing' ? 'info' :
                                                    order.status === 'shipped' ? 'primary' :
                                                    order.status === 'delivered' ? 'success' :
                                                    'secondary'
                                                }`}>
                                                {order.status_display || order.status} {/* Usa status_display si tu backend lo provee */}
                                                </span>
                                            </td>
                                            <td className="align-middle">{formatPrice(order.total_amount)}</td>
                                            <td className="align-middle">
                                                <Button
                                                    as={Link}
                                                    to={`/mis-ordenes/${order.order_number}`}
                                                    variant="outline-primary"
                                                    size="sm"
                                                    >
                                                    Ver Detalles
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderHistoryPage;