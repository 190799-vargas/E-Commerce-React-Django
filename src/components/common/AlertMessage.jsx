import { Alert } from "react-bootstrap";

/**
 * Componente de Mensaje de Alerta reutilizable.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.variant - Variante de la alerta (success, danger, warning, info).
 * @param {string} props.message - El mensaje a mostrar.
 */
const AlertMessage = ({ variant = 'info', message}) => {
    if (!message) {
        return null
    }

    return (
        <Alert variant={variant} className="my-3">
            {message}
        </Alert>
    );
};

export default AlertMessage;