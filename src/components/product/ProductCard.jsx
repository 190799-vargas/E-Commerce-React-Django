// ProductCard.jsx
import { Star, Truck } from 'lucide-react'; // Íconos de estrella y camión
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers'; // Importación de formatPrice desde helpers.js

const ProductCard = ({ product }) => {
    // La función formatPrice ahora se importa desde helpers.js
    // por lo tanto, la definición local ya no es necesaria y se ha eliminado.

    const getDiscountedPrice = () => {
        if (product.original_price && product.discount_percentage) {
            return product.original_price * (1 - product.discount_percentage / 100);
        }
        return product.price;
    };

    return (
        <Card className="h-100 shadow-sm border-0">
            <Link to={`/producto/${product.slug}`} className="text-decoration-none">
                <Card.Img
                    variant="top"
                    src={product.primary_image || 'https://via.placeholder.com/250x200?text=No+Image'}
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
                />
            </Link>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-dark fs-6 mb-2">
                    <Link to={`/producto/${product.slug}`} className="text-decoration-none text-dark">
                        {product.title}
                    </Link>
                </Card.Title>
                <Card.Text className="text-muted mb-1 small">
                    {product.category_name}
                </Card.Text>
                <div className="d-flex align-items-center mb-2">
                    {product.average_rating > 0 && (
                        <span className="text-warning me-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(product.average_rating) ? "currentColor" : "none"} strokeWidth={1} />
                            ))}
                        </span>
                    )}
                    {product.review_count > 0 && (
                        <span className="text-muted small">({product.review_count})</span>
                    )}
                </div>
                <div className="mb-2">
                    {product.original_price && product.discount_percentage ? (
                        <>
                            <p className="text-danger fw-bold fs-5 mb-0">
                                {formatPrice(getDiscountedPrice())}
                                <span className="ms-2 badge bg-success">{product.discount_percentage}% OFF</span>
                            </p>
                            <p className="text-muted text-decoration-line-through small">{formatPrice(product.original_price)}</p>
                        </>
                    ) : (
                        <p className="fw-bold fs-5 mb-0">{formatPrice(product.price)}</p>
                    )}
                </div>
                {product.free_shipping && (
                    <p className="text-success small mb-2"><Truck size={16} className="me-1" /> Envío gratis</p>
                )}
                <Button variant="primary" className="mt-auto w-100">
                    Agregar al Carrito
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;