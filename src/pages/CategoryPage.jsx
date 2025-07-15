// src/pages/CategoryPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductFilterSidebar from '../components/product/ProductFilterSidebar';
import categoryService from '../services/categoryService';
import productService from '../services/productService';

const CategoryPage = () => {
    const { categorySlug } = useParams();
    
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});

    // Cargar productos de la categoría y detalles de la categoría
    const fetchProductsAndCategory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtener los productos para la categoría específica
            const productsData = await productService.getProductsByCategory(categorySlug, {
                ...filters,
                page: currentPage,
            });

            // CORRECCIÓN CLAVE: Usar el operador de encadenamiento opcional (?.) y el operador de fusión nula (||)
            // Esto asegura que productsData?.results siempre sea un array o un array vacío si es undefined/null
            setProducts(productsData?.results || []);
            setTotalPages(productsData?.total_pages || 1); // También asegurar valores por defecto
            setCurrentPage(productsData?.current_page || 1); // También asegurar valores por defecto

            // 2. Obtener los detalles de la categoría para mostrar su nombre
            const categoryData = await categoryService.getCategoryDetail(categorySlug);
            setCategory(categoryData);

        } catch (err) {
            setError('Error al cargar la categoría y sus productos. Por favor, inténtalo de nuevo.');
            console.error('Error fetching category page data:', err);
            // CORRECCIÓN: En caso de error, también asegurar que 'products' vuelva a ser un array vacío
            setProducts([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, [categorySlug, currentPage, filters]);

    useEffect(() => {
        fetchProductsAndCategory();
    }, [fetchProductsAndCategory]);

    // Manejar cambio de página
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Manejar la aplicación de filtros
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reiniciar la paginación al cambiar los filtros
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando productos de la categoría...</span>
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

    return (
        <Container className="my-5">
            <Row>
                {/* Barra lateral de filtros */}
                <Col md={3}>
                    <ProductFilterSidebar
                        onFilterChange={handleFilterChange}
                        initialFilters={filters}
                    />
                </Col>

                {/* Listado de productos */}
                <Col md={9}>
                    <h1 className="mb-4">{category ? category.name : 'Productos'}</h1>
                    {/* products ya está inicializado a [] y se asegura que siempre sea un array */}
                    {products.length === 0 ? (
                        <Alert variant="info">No se encontraron productos en esta categoría.</Alert>
                    ) : (
                        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                            {products.map(product => (
                                <Col key={product.id}>
                                <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CategoryPage;