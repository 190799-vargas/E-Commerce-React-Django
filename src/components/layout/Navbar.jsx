import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Componente de Barra de Navegación genérico.
 * Este componente es una envoltura básica de Bootstrap Navbar.
 * La lógica de navegación detallada (ej. categorías, búsqueda, usuario)
 * se encuentra actualmente en Header.jsx.
 * Puedes expandir este componente y refactorizar Header.jsx si deseas
 * una separación más estricta de las responsabilidades.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido a renderizar dentro de la barra de navegación (ej. Nav.Link, NavDropdown).
 */
const Navbar = ({ children }) => {
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                {/* Aquí podrías tener el brand o el toggle */}
                <BootstrapNavbar.Brand as={Link} to="/">Tu App</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Aquí se renderizarán los elementos de navegación pasados como children */}
                        {children}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;