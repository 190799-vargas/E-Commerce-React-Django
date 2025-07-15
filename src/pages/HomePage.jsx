import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProductCard from "../components/product/ProductCard";
import categoryService from "../services/categoryService";
import productService from "../services/productService";

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [popularCategories, setPopularCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Cargar productos destacados (asumiendo que productService tiene una función para esto)
                // Nota: Si no tienes un endpoint específico, puedes usar la búsqueda con un filtro 'featured'
                const products = await productService.getFeaturedProducts();
                setFeaturedProducts(products);

                // Cargar categorías populares
                const categories = await categoryService.getPopularCategories();
                setPopularCategories(categories);
            } catch (err) {
                setError('Error al cargar la página de inicio. Por favor, inténtalo de nuevo.');
                console.error('Error fetching home page data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Cargando contenido principal..." />;
    }

    if (error) {
        return <AlertMessage variant="danger" message={error} />;
    }

    return (
        <Container className="my-5">
            {/** Carrusel Principal / Hero Section */}
            <Card className="bg-light text-center p-5 mb-5">
                <h1 className="display-4">Bienvenido a E-CommerceApp</h1>
                <p className="lead">Descubre las mejores ofertas y productos de alta calidad.</p>
                <hr className="my-4" />
                <Button as={Link} to="/productos" variant="primary" size="lg">
                    Explora nuestros productos
                </Button>
            </Card>

            {/* Productos Destacados */}
            <section className="mb-5">
                <h2 className="mb-4 text-center">Productos Destacados</h2>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map(product => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                        ))
                    ) : (
                        <Col><Alert variant="info" className="text-center">No hay productos destacados disponibles.</Alert></Col>
                    )}
                </Row>
            </section>

            {/* Categorías Populares */}
            <section className="mb-5">
                <h2 className="mb-4 text-center">Categorías Populares</h2>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {popularCategories.length > 0 ? (
                        popularCategories.map(category => (
                        <Col key={category.slug}>
                            <Card className="h-100 text-center shadow-sm">
                                <Card.Body>
                                    <Card.Title>{category.name}</Card.Title>
                                    <Card.Text>
                                        {category.product_count} productos disponibles.
                                    </Card.Text>
                                    <Button as={Link} to={`/categorias/${category.slug}`} variant="outline-primary">
                                        Ver Categoría
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        ))
                    ) : (
                        <Col><AlertMessage variant="info" message="No se encontraron categorías populares." /></Col>
                    )}
                </Row>
            </section>
        </Container>
    );
};

export default HomePage;