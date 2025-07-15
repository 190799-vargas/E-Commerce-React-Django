// src/components/Header.jsx
import { Package, Search, ShoppingCart, User } from 'lucide-react'; // Importar iconos de Lucide React
import { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import categoryService from '../../services/categoryService'; // Importar el nuevo servicio de categorías

const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]); // Nuevo estado para las categorías

    // Función para cargar las categorías al inicio
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const tree = await categoryService.getCategoryTree();
            setCategories(tree);
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
            // Opcional: toast.error('Error al cargar las categorías de navegación.');
        }
        };
        fetchCategories();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
        navigate(`/productos?q=${searchQuery}`); // Redirige a la página de productos con el query
        setSearchQuery(''); // Limpiar el input después de la búsqueda
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirigir a la página de inicio después del logout
    };

    // Función auxiliar para renderizar subcategorías recursivamente
    const renderSubcategories = (subcategories) => {
        if (!subcategories || subcategories.length === 0) {
        return null;
        }
        return (
        <NavDropdown renderMenuOnMount> {/* renderMenuOnMount para que funcione correctamente en mobile/responsive */}
            {subcategories.map(cat => (
            cat.children && cat.children.length > 0 ? (
                <NavDropdown
                title={cat.name}
                id={`dropdown-sub-${cat.slug}`}
                key={cat.slug}
                drop="end" // Muestra el submenú a la derecha
                renderMenuOnMount
                >
                <NavDropdown.Item as={Link} to={`/categorias/${cat.slug}`}>
                    Ver todos en {cat.name}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {renderSubcategories(cat.children)}
                </NavDropdown>
            ) : (
                <NavDropdown.Item as={Link} to={`/categorias/${cat.slug}`} key={cat.slug}>
                {cat.name}
                </NavDropdown.Item>
            )
            ))}
        </NavDropdown>
        );
    };


    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">E-CommerceApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/productos">Productos</Nav.Link>

                        {/* Menú desplegable de Categorías */}
                        {categories.length > 0 && (
                        <NavDropdown title="Categorías" id="basic-nav-dropdown">
                            {categories.map(category => (
                            category.children && category.children.length > 0 ? (
                                <NavDropdown
                                title={category.name}
                                id={`dropdown-${category.slug}`}
                                key={category.slug}
                                drop="end" // Muestra el submenú a la derecha
                                renderMenuOnMount
                                >
                                <NavDropdown.Item as={Link} to={`/categorias/${category.slug}`}>
                                    Ver todos en {category.name}
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                {renderSubcategories(category.children)}
                                </NavDropdown>
                            ) : (
                                <NavDropdown.Item as={Link} to={`/categorias/${category.slug}`} key={category.slug}>
                                {category.name}
                                </NavDropdown.Item>
                            )
                            ))}
                        </NavDropdown>
                        )}
                    </Nav>

                    {/* Formulario de Búsqueda */}
                    <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
                        <FormControl
                        type="search"
                        placeholder="Buscar productos..."
                        className="me-2"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="outline-light" type="submit">
                        <Search size={20} />
                        </Button>
                    </Form>

                    <Nav>
                        <Nav.Link as={Link} to="/carrito">
                        <ShoppingCart size={20} className="me-1" /> Carrito
                        </Nav.Link>

                        {isAuthenticated ? (
                        <NavDropdown title={<span><User size={20} className="me-1" /> {user?.username || 'Mi Cuenta'}</span>} id="user-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/mis-ordenes">
                            <Package size={18} className="me-1" /> Mis Órdenes
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>
                        ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                            <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
                        </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;