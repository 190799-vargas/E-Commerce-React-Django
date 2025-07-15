// ProductsPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom'; // Para manejar los parámetros de la URL
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination'; // Importación del componente Pagination
import ProductCard from '../components/product/ProductCard';
import ProductFilterSidebar from '../components/product/ProductFilterSidebar';
import productService from '../services/productService';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar los query params

    // Estados para filtros y búsqueda, inicializados desde los parámetros de la URL
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [categorySlug, setCategorySlug] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [freeShipping, setFreeShipping] = useState(searchParams.get('free_shipping') === 'true');
    const [condition, setCondition] = useState(searchParams.get('condition') || '');
    const [orderBy, setOrderBy] = useState(searchParams.get('order_by') || '-created_at');

    // Estados para la paginación, actualizados por la respuesta de la API
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Función para construir y aplicar los parámetros de búsqueda, reiniciando la página a 1
    const applyFilters = useCallback(() => {
        const newParams = {};
        if (searchTerm) newParams.q = searchTerm;
        if (categorySlug) newParams.category = categorySlug;
        if (minPrice) newParams.min_price = minPrice;
        if (maxPrice) newParams.max_price = maxPrice;
        if (freeShipping) newParams.free_shipping = true;
        if (condition) newParams.condition = condition;
        if (orderBy) newParams.order_by = orderBy;
        newParams.page = 1; // Siempre reinicia la página a 1 al aplicar nuevos filtros
        setSearchParams(newParams); // Actualiza la URL
    }, [searchTerm, categorySlug, minPrice, maxPrice, freeShipping, condition, orderBy, setSearchParams]);

    // Efecto para cargar productos cuando cambian los parámetros de la URL
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Obtener todos los parámetros actuales de searchParams
                const params = Object.fromEntries([...searchParams]);
                // Asegurarse de que el parámetro de página sea un número entero, por defecto 1
                const pageParam = parseInt(searchParams.get('page')) || 1;

                // Pasar todos los parámetros, incluyendo la página, a la función de servicio
                const data = await productService.getProducts({ ...params, page: pageParam });

                setProducts(data.results); // Asumiendo que la API devuelve los productos en 'results'
                setCurrentPage(data.current_page); // Asumiendo que la API devuelve la página actual
                setTotalPages(data.total_pages);   // Asumiendo que la API devuelve el total de páginas
            } catch (err) {
                setError('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]); // Se vuelve a ejecutar cuando los parámetros de la URL cambian

    // Manejadores para los cambios en los filtros y búsqueda
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters(); // Resetea la página a 1
    };

    const handleFilterChange = (filterName, value) => {
        switch (filterName) {
            case 'category':
                setCategorySlug(value);
                break;
            case 'min_price':
                setMinPrice(value);
                break;
            case 'max_price':
                setMaxPrice(value);
                break;
            case 'free_shipping':
                setFreeShipping(value);
                break;
            case 'condition':
                setCondition(value);
                break;
            case 'order_by':
                setOrderBy(value);
                break;
            default:
                break;
        }
    };

    const handleApplyFiltersClick = () => {
        applyFilters(); // Resetea la página a 1
    };

    // Manejador para el cambio de página
    const handlePageChange = (pageNumber) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, page: pageNumber });
    };

    if (loading) {
        return <LoadingSpinner message="Cargando productos..." />;
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={3}>
                    {/* Sidebar de filtros */}
                    <ProductFilterSidebar
                        categorySlug={categorySlug}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        freeShipping={freeShipping}
                        condition={condition}
                        orderBy={orderBy}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFiltersClick}
                        currentSearchTerm={searchTerm}
                    />
                </Col>
                <Col md={9}>
                    <h1 className="mb-4">Productos</h1>

                    {/* Barra de búsqueda dentro de la columna de productos */}
                    <Form className="d-flex mb-4" onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="search"
                            placeholder="Buscar productos..."
                            className="me-2"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit">Buscar</Button>
                    </Form>

                    {products.length === 0 ? (
                        <Alert variant="info">No se encontraron productos que coincidan con tu búsqueda o filtros.</Alert>
                    ) : (
                        <>
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {products.map(product => (
                                    <Col key={product.slug}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                            {/* Componente de paginación */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProductsPage;