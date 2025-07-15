// src/pages/UserProfilePage.jsx
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Para obtener el usuario autenticado y saber su ID si fuera necesario
import authService from '../services/authService';

const UserProfilePage = () => {
    const { isAuthenticated, logout } = useAuth(); // Usamos isAuthenticated para proteger la ruta
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        avatar: null, // Para manejar la carga de archivos
        is_seller: false,
        // Datos de UserProfileModel (si los quieres editar directamente aquí o en otra sección)
        bio: '',
        birth_date: '',
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null); // Para mostrar la vista previa de la imagen

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
        navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Cargar datos del perfil al montar el componente
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await authService.getUserProfile();
            // Asegúrate de que los campos del estado coincidan con los de tu serializer UserProfileSerializer
            setProfile({
            username: data.username || '',
            email: data.email || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            avatar: data.avatar || null, // URL del avatar actual
            is_seller: data.is_seller || false,
            bio: data.user_profile?.bio || '', // Accede a los campos anidados si tu serializer los anida
            birth_date: data.user_profile?.birth_date || '',
            });
            setAvatarPreview(data.avatar); // Establece la URL del avatar actual como vista previa
        } catch (err) {
            if (err.detail === 'Las credenciales de autenticación no se proveyeron.') {
            // Si el token expiró o no es válido, desloguear
            logout();
            }
            setError('Error al cargar el perfil. Por favor, inténtalo de nuevo.');
            console.error('Error al cargar perfil:', err);
        } finally {
            setLoading(false);
        }
        };

        if (isAuthenticated) { // Solo intenta cargar si está autenticado
        fetchProfile();
        }
    }, [isAuthenticated, logout]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
        setProfile({ ...profile, [name]: files[0] });
        if (files[0]) {
            setAvatarPreview(URL.createObjectURL(files[0])); // Crea URL para vista previa
        } else {
            setAvatarPreview(profile.avatar); // Vuelve a la URL original si se borra
        }
        } else {
        setProfile({ ...profile, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const formDataToSend = new FormData();
        // Añadir campos de User (los que se pueden editar)
        formDataToSend.append('username', profile.username);
        formDataToSend.append('first_name', profile.first_name);
        formDataToSend.append('last_name', profile.last_name);
        formDataToSend.append('phone', profile.phone);
        formDataToSend.append('address', profile.address);
        formDataToSend.append('city', profile.city);
        formDataToSend.append('country', profile.country);
        formDataToSend.append('is_seller', profile.is_seller); // Si se puede cambiar desde aquí

        // Si tu UserProfileSerializer es un campo anidado, deberás enviar los datos de UserProfile así:
        // formDataToSend.append('user_profile.bio', profile.bio);
        // formDataToSend.append('user_profile.birth_date', profile.birth_date);
        // IMPORTANTE: Para campos anidados, FormData puede ser complicado. Podrías necesitar enviar JSON.
        // Si tu UserProfileSerializer está aplanado o usa source='user_profile.bio', etc., entonces como sigue:
        formDataToSend.append('bio', profile.bio);
        formDataToSend.append('birth_date', profile.birth_date);


        if (profile.avatar && typeof profile.avatar !== 'string') { // Si es un nuevo archivo y no una URL
        formDataToSend.append('avatar', profile.avatar);
        } else if (profile.avatar === null && avatarPreview === null) {
        // Si el avatar se eliminó (se establece a null), envia una cadena vacía para indicar "eliminar"
        // Esto depende de cómo maneje tu backend la eliminación de imágenes.
        // Algunos backends requieren que envíes la URL existente para mantenerla,
        // y null/cadena vacía para eliminarla.
        // formDataToSend.append('avatar', ''); // Puede que no sea necesario, depende del serializer
        }


        try {
        // Envía FormData si tienes un campo de archivo (avatar)
        const updatedData = await authService.updateProfile(formDataToSend);
        setSuccess('Perfil actualizado exitosamente!');
        // Opcional: Actualizar el estado del usuario en AuthContext si la API devuelve el UserSerializer actualizado
        // (Para esto, necesitarías que tu AuthContext tenga una función para actualizar el usuario)
        // Ejemplo: updateAuthUser(updatedData);

        } catch (err) {
        if (err) {
            let errorMessages = [];
            for (const key in err) {
            if (Array.isArray(err[key])) {
                err[key].forEach(msg => errorMessages.push(`${key}: ${msg}`));
            } else {
                errorMessages.push(`${key}: ${err[key]}`);
            }
            }
            setError(errorMessages.join(' | '));
        } else {
            setError('Error desconocido al actualizar el perfil.');
        }
        console.error('Error al actualizar perfil:', err);
        } finally {
        setSubmitting(false);
        }
    };

    if (loading) {
        return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando perfil...</span>
            </Spinner>
        </Container>
        );
    }

    // Si no está autenticado, el useEffect ya redirigió
    if (!isAuthenticated && !loading) {
        return null; // No renderizar nada mientras se redirige
    }

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Mi Perfil</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formUsername">
                                            <Form.Label>Nombre de Usuario</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={profile.username}
                                                onChange={handleChange}
                                                required
                                                disabled={true} // El username a menudo no se edita directamente
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                required
                                                disabled={true} // El email a menudo no se edita directamente
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formFirstName">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={profile.first_name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formLastName">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={profile.last_name}
                                            onChange={handleChange}
                                    />
                                    </Form.Group>
                                </Col>
                                </Row>

                                <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formAddress">
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={profile.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                </Row>

                                <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formCity">
                                        <Form.Label>Ciudad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formCountry">
                                        <Form.Label>País</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="country"
                                            value={profile.country}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                </Row>

                                {/* Campos específicos de UserProfile si quieres editarlos directamente aquí */}
                                <Form.Group className="mb-3" controlId="formBio">
                                    <Form.Label>Biografía</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBirthDate">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birth_date"
                                        value={profile.birth_date}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formIsSeller">
                                    <Form.Check
                                        type="checkbox"
                                        label="Soy Vendedor"
                                        name="is_seller"
                                        checked={profile.is_seller}
                                        onChange={handleChange}
                                        disabled={true} // Generalmente esto no se cambia tan fácil desde el perfil
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formAvatar">
                                    <Form.Label>Avatar</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                    {avatarPreview && (
                                        <div className="mt-2">
                                            <img
                                                src={avatarPreview}
                                                alt="Vista previa del avatar"
                                                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        {' '}Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;