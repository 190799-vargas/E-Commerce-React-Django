// src/components/product/ProductReviewForm.jsx
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productService from '../../services/productService'; // Asegúrate de que la ruta sea correcta

/**
 * Componente de formulario para enviar reseñas de productos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string|number} props.productId - El ID numérico del producto al que se le va a dejar la reseña.
 * @param {boolean} props.isAuthenticated - Indica si el usuario está autenticado.
 * @param {function} props.onReviewSubmitted - Callback que se ejecuta al enviar exitosamente una reseña, recibe la nueva reseña.
 */
const ProductReviewForm = ({ productId, isAuthenticated, onReviewSubmitted }) => {
    const [reviewFormData, setReviewFormData] = useState({ rating: 0, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(null);
    const [reviewError, setReviewError] = useState(null);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewFormData({ ...reviewFormData, [name]: value });
    };

    const handleRatingClick = (ratingValue) => {
        setReviewFormData({ ...reviewFormData, rating: ratingValue });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError(null);
        setReviewSuccess(null);

        if (reviewFormData.rating === 0) {
            setReviewError('Por favor, selecciona una calificación.');
            setSubmittingReview(false);
            return;
        }
        if (!reviewFormData.comment.trim()) {
            setReviewError('Por favor, escribe un comentario.');
            setSubmittingReview(false);
            return;
        }

        try {
            const newReview = await productService.submitProductReview(productId, reviewFormData);
            setReviewSuccess('Tu reseña ha sido enviada exitosamente!');
            setReviewFormData({ rating: 0, comment: '' }); // Limpiar formulario
            if (onReviewSubmitted) {
                onReviewSubmitted(newReview); // Notificar al componente padre
            }
        } catch (err) {
            if (err.detail) {
                setReviewError(err.detail);
            } else if (err && typeof err === 'object') {
                let errorMessages = [];
                for (const key in err) {
                    if (Array.isArray(err[key])) {
                        err[key].forEach(msg => errorMessages.push(`${key}: ${msg}`));
                    } else {
                        errorMessages.push(`${key}: ${err[key]}`);
                    }
                }
                setReviewError(errorMessages.join(' | '));
            } else {
                setReviewError('Error al enviar la reseña.');
            }
            console.error('Error submitting review:', err);
        } finally {
        setSubmittingReview(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Alert variant="info" className="mt-4">
                <Link to="/login">Inicia sesión</Link> para dejar una reseña.
            </Alert>
        );
    }

    return (
        <div className="mt-4">
            <h5>Deja tu reseña</h5>
            {reviewError && <Alert variant="danger">{reviewError}</Alert>}
            {reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}
            <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Calificación:</Form.Label>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                className="text-warning me-1"
                                fill={star <= reviewFormData.rating ? "currentColor" : "none"}
                                strokeWidth={1}
                                onClick={() => handleRatingClick(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                </Form.Group>
                    <Form.Group className="mb-3" controlId="reviewComment">
                    <Form.Label>Comentario:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="comment"
                        value={reviewFormData.comment}
                        onChange={handleReviewChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submittingReview}>
                    {submittingReview ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Enviar Reseña'}
                </Button>
            </Form>
        </div>
    );
};

export default ProductReviewForm;