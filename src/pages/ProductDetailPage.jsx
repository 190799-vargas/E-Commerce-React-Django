// src/pages/ProductDetailPage.jsx
import { MinusCircle, PlusCircle, ShoppingCart, Star, Truck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap'; // Se eliminó Carousel ya que ahora se usa ProductCarousel
import { Link, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
import productService from '../services/productService';

import ProductCarousel from '../components/product/ProductCarousel'; // Importa el componente ProductCarousel
import ProductReviewForm from '../components/product/ProductReviewForm';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const { isAuthenticated, user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Función para formatear el precio a moneda (puede ir a utils/helpers.js)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const getDiscountedPrice = (originalPrice, discountPercentage) => {
        if (originalPrice && discountPercentage) {
            return originalPrice * (1 - discountPercentage / 100);
        }
        return null;
    };

    // Cargar los detalles del producto
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productService.getProductDetail(slug);
                setProduct(data);
            } catch (err) {
                setError('Error al cargar el producto. Por favor, inténtalo de nuevo.');
                console.error('Error fetching product detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Manejar cantidad para el carrito
    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(prev => Math.min(prev + 1, product.stock));
        } else {
            setQuantity(prev => Math.max(prev - 1, 1));
        }
    };

    // Callback para cuando una reseña es enviada exitosamente desde ProductReviewForm
    const handleReviewSubmitted = (newReview) => {
        // Actualizar las reseñas del producto en el estado de ProductDetailPage
        setProduct(prevProduct => ({
            ...prevProduct,
            reviews: [...prevProduct.reviews, newReview],
            // También podrías recalcular el promedio de calificación aquí si lo necesitas
            review_count: prevProduct.review_count + 1
        }));
    };

    // Función para agregar al carrito
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info('Por favor, inicia sesión para agregar productos al carrito.');
            return;
        }
        setAddingToCart(true);
        try {
            await orderService.addToCart(product.id, quantity);
            toast.success(`${quantity} x "${product.title}" añadido al carrito.`);
        } catch (err) {
            toast.error('Error al añadir el producto al carrito.');
            console.error('Error adding to cart:', err);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando producto...</span>
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

    if (!product) {
        return (
            <Container className="my-5">
                <Alert variant="info">Producto no encontrado.</Alert>
            </Container>
        );
    }

    const discountedPrice = getDiscountedPrice(product.original_price, product.discount_percentage);

    return (
        <Container className="my-5">
            <Row>
                {/* Columna de Imágenes del Producto */}
                <Col md={6} className="mb-4">
                    <ProductCarousel images={product.images} title={product.title} />
                </Col>

                {/* Columna de Información del Producto */}
                <Col md={6}>
                    <h1 className="mb-3">{product.title}</h1>
                    <p className="text-muted small mb-2">
                        <Link to={`/categorias/${product.category_slug}`} className="text-decoration-none">
                            {product.category_name}
                        </Link>
                        | Vendedor: <Link to={`/vendedor/${product.seller_username}`} className="text-decoration-none">
                            {product.seller_username}
                        </Link>
                    </p>

                    <div className="d-flex align-items-center mb-3">
                        {product.average_rating > 0 && (
                            <span className="text-warning me-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} size={20} fill={i < Math.floor(product.average_rating) ? "currentColor" : "none"} strokeWidth={1} />
                                ))}
                            </span>
                        )}
                        {product.review_count > 0 && (
                            <span className="text-muted small">({product.review_count} {product.review_count === 1 ? 'reseña' : 'reseñas'})</span>
                        )}
                        {product.review_count === 0 && <span className="text-muted small">Sin reseñas aún</span>}
                    </div>

                    <div className="mb-3">
                        {discountedPrice ? (
                            <>
                                <p className="text-danger fw-bold fs-3 mb-0">
                                    {formatPrice(discountedPrice)}
                                    <span className="ms-3 badge bg-success">{product.discount_percentage}% OFF</span>
                                </p>
                                <p className="text-muted text-decoration-line-through fs-5">{formatPrice(product.original_price)}</p>
                            </>
                        ) : (
                            <p className="fw-bold fs-3 mb-0">{formatPrice(product.price)}</p>
                        )}
                    </div>

                    <p className="mb-2">
                        <strong>Condición:</strong> {product.condition === 'New' ? 'Nuevo' : 'Usado'}
                    </p>
                    {product.free_shipping && (
                        <p className="text-success fw-bold mb-3"><Truck size={20} className="me-2" /> Envío gratis</p>
                    )}

                    <p className="mb-4">{product.description}</p>

                    {/* Sección de Stock y Cantidad */}
                    <div className="d-flex align-items-center mb-4">
                        <h5 className="mb-0 me-3">Cantidad:</h5>
                        <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange('decrement')}
                            disabled={quantity <= 1}
                            size="sm"
                        >
                            <MinusCircle size={20} />
                        </Button>
                        <Form.Control
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1 && val <= product.stock) {
                                    setQuantity(val);
                                } else if (val < 1) {
                                    setQuantity(1);
                                } else if (val > product.stock) {
                                    setQuantity(product.stock);
                                }
                            }}
                            min="1"
                            max={product.stock}
                            className="text-center mx-2"
                            style={{ width: '80px' }}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange('increment')}
                            disabled={quantity >= product.stock}
                            size="sm"
                        >
                            <PlusCircle size={20} />
                        </Button>
                        <span className="ms-3 text-muted">{product.stock} disponibles</span>
                    </div>

                    {/* Botón de Agregar al Carrito */}
                    <div className="d-grid gap-2 mb-5">
                        <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={addingToCart || product.stock === 0}>
                            {addingToCart ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    {' '}Agregando...
                                </>
                            ) : (
                                <><ShoppingCart size={20} className="me-2" /> Agregar al Carrito</>
                            )}
                        </Button>
                        <Button variant="success" size="lg" disabled={product.stock === 0}>
                            Comprar Ahora
                        </Button>
                        {product.stock === 0 && <Alert variant="warning" className="mt-2 text-center">Producto sin stock.</Alert>}
                    </div>

                    {/* Atributos del Producto */}
                    {product.attributes && product.attributes.length > 0 && (
                        <Card className="mb-4">
                            <Card.Header>Atributos del Producto</Card.Header>
                            <ListGroup variant="flush">
                                {product.attributes.map((attr) => (
                                    <ListGroup.Item key={attr.id}>
                                        <strong>{attr.name}:</strong> {attr.value}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}

                    {/* Sección de Reseñas */}
                    <Card>
                        <Card.Header>Reseñas de Clientes ({product.review_count})</Card.Header>
                        <Card.Body>
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div key={review.id} className="mb-3 border-bottom pb-3">
                                        <p className="mb-1">
                                            <strong><User size={16} className="me-1" /> {review.user_username}</strong>
                                            <span className="ms-2 text-warning">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                                                ))}
                                            </span>
                                            <span className="ms-2 text-muted small">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </p>
                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Este producto no tiene reseñas aún.</p>
                            )}

                            {/* Integración del componente ProductReviewForm */}
                            <ProductReviewForm
                                productId={product.id}
                                isAuthenticated={isAuthenticated}
                                onReviewSubmitted={handleReviewSubmitted}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;