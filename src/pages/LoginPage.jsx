import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/authService";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // Función login del contexto

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await authService.login(formData);
            // Usamos la función login del contexto para guardar los tokens y el usuario
            login(data.access, data.refresh, data.user);
        } catch (err) {
            if (err && err.detail) { // Django REST Framework a menudo usa 'detail' para errores de autenticación
                setError(err.detail);
            } else if (err && typeof err === 'object') {
                let errorMessages = [];
                for (const key in err) {
                    if (Array.isArray(err[key])) {
                        err[key].forEach(msg => errorMessages.push(`${key}: ${msg}`));
                    } else {
                        errorMessages.push(`${key}: ${err[key]}`);
                    }
                }
                setError(errorMessages.join(' | '));
            }
            else {
                setError('Error desconocido al iniciar sesión.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;