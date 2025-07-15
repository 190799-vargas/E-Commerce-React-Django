import { GithubIcon, LinkedinIcon, Mail, MapPin, Phone } from "lucide-react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <Container>
                <Row>
                    <Col md={4} className="mb-3">
                        <h5>E-CommerceApp</h5>
                        <p className="text-muted">
                            Tu tienda online de confianza para todo lo que necesitas.
                        </p>
                    </Col>

                    <Col md={4} className="mb-3">
                        <h5>Enlaces Rápidos</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/productos" className="text-muted p-0 py-1">Productos</Nav.Link>
                            <Nav.Link as={Link} to="/about" className="text-muted p-0 py-1">Sobre Nosotros</Nav.Link>
                            <Nav.Link as={Link} to="/contacto" className="text-muted p-0 py-1">Contacto</Nav.Link>
                            <Nav.Link as={Link} to="/faq" className="text-muted p-0 py-1">Preguntas Frecuentes</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={4} className="mb-3">
                        <h5>Contacto y Redes</h5>
                        
                        {/* Información de contacto con iconos */}
                        <div className="text-muted mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <MapPin size={18} className="me-2 text-white" />
                                <span>Barrio Nueva Jerusalén, Medellín, Colombia</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <Mail size={18} className="me-2 text-white" />
                                <span>victor19vargas2018@gmail.com</span>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <Phone size={18} className="me-2 text-white" />
                                <span>+57 323 381 2937</span>
                            </div>
                        </div>

                        {/* Redes sociales con iconos */}
                        <div className="d-flex">
                            <a href="https://github.com/tu-usuario"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white me-3"
                                    title="GitHub"
                                >
                                    <GithubIcon size={24}
                            />
                            </a>
                            <a href="https://www.linkedin.com/in/tu-perfil"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white me-3"
                                    title="LinkedIn"
                                >
                                    <LinkedinIcon size={24}
                            />
                            </a>
                            <a href="mailto:victor19vargas2018@gmail.com"
                                    className="text-white me-3"
                                    title="Enviar email"
                                >
                                    <Mail size={24}
                            />
                            </a>
                            <a href="tel:+573233812937"
                                    className="text-white"
                                    title="Llamar"
                                >
                                    <Phone size={24}
                            />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-4 border-top pt-3">
                    <Col className="text-center text-muted">
                        <p className="mb-0">&copy; {new Date().getFullYear()} E-CommerceApp. Todos los derechos reservados.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;