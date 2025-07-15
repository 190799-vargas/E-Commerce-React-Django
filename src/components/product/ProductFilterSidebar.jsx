// src/components/product/ProductFilterSidebar.jsx
import { Filter, SortAsc, Tag } from 'lucide-react'; // Íconos para los filtros
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import productService from '../../services/productService';

const ProductFilterSidebar = ({
    categorySlug,
    minPrice,
    maxPrice,
    freeShipping,
    condition,
    orderBy,
    onFilterChange,
    onApplyFilters,
}) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Cargar categorías al montar
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await productService.getCategoryTree(); // Usamos getCategoryTree
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoadingCategories(false);
        }
        };
        fetchCategories();
    }, []);

    // Función recursiva para renderizar el árbol de categorías
    const renderCategoryTree = (nodes) => {
        return (
        <ListGroup variant="flush">
            {nodes.map(node => (
            <React.Fragment key={node.slug}>
                <ListGroup.Item
                action
                onClick={() => onFilterChange('category', node.slug)}
                active={categorySlug === node.slug}
                className="d-flex justify-content-between align-items-center"
                >
                {node.name}
                {node.icon && <span className={`text-${node.color_class || 'muted'}`}><i className={`lucide lucide-${node.icon}`}></i></span>}
                </ListGroup.Item>
                {node.subcategories && node.subcategories.length > 0 && (
                <div className="ms-3">
                    {renderCategoryTree(node.subcategories)}
                </div>
                )}
            </React.Fragment>
            ))}
        </ListGroup>
        );
    };


    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                <Card.Title className="mb-3 d-flex align-items-center">
                    <Filter size={20} className="me-2" /> Filtros
                </Card.Title>

                <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
                    {/* Filtro por Categorías */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header><Tag size={18} className="me-2" /> Categorías</Accordion.Header>
                        <Accordion.Body>
                            {loadingCategories ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                <ListGroup variant="flush">
                                    <ListGroup.Item
                                        action
                                        onClick={() => onFilterChange('category', '')}
                                        active={categorySlug === ''}
                                        >
                                        Todas las Categorías
                                    </ListGroup.Item>
                                </ListGroup>
                                {renderCategoryTree(categories)}
                                </>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Filtro por Precio */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header><SortAsc size={18} className="me-2" /> Precio</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio Mínimo</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="Mín."
                                        value={minPrice}
                                        onChange={(e) => onFilterChange('min_price', e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio Máximo</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="Máx."
                                        value={maxPrice}
                                        onChange={(e) => onFilterChange('max_price', e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Filtro por Envío Gratis */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Envío</Accordion.Header>
                        <Accordion.Body>
                            <Form.Check
                                type="checkbox"
                                label="Envío Gratis"
                                checked={freeShipping}
                                onChange={(e) => onFilterChange('free_shipping', e.target.checked)}
                            />
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Filtro por Condición */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Condición</Accordion.Header>
                        <Accordion.Body>
                            <Form.Check
                                type="radio"
                                label="Nuevo"
                                name="conditionRadio"
                                value="New"
                                checked={condition === 'New'}
                                onChange={(e) => onFilterChange('condition', e.target.value)}
                                id="condition-new"
                            />
                            <Form.Check
                                type="radio"
                                label="Usado"
                                name="conditionRadio"
                                value="Used"
                                checked={condition === 'Used'}
                                onChange={(e) => onFilterChange('condition', e.target.value)}
                                id="condition-used"
                            />
                            <Form.Check
                                type="radio"
                                label="Todos"
                                name="conditionRadio"
                                value=""
                                checked={condition === ''}
                                onChange={(e) => onFilterChange('condition', e.target.value)}
                                id="condition-all"
                            />
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Ordenar por */}
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Ordenar por</Accordion.Header>
                        <Accordion.Body>
                            <Form.Select value={orderBy} onChange={(e) => onFilterChange('order_by', e.target.value)}>
                                <option value="-created_at">Más Recientes</option>
                                <option value="price">Precio: Más Bajo Primero</option>
                                <option value="-price">Precio: Más Alto Primero</option>
                                <option value="-sales_count">Más Vendidos</option>
                                <option value="-views_count">Más Vistos</option>
                            </Form.Select>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Button variant="primary" className="w-100 mt-3" onClick={onApplyFilters}>
                Aplicar Filtros
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductFilterSidebar;