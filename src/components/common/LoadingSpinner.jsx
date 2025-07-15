import { Spinner } from "react-bootstrap";

/**
 * Componente de Spinner de Carga reutilizable.
 * Muestra un spinner centrado con un mensaje opcional.
 * @param {object} props - Propiedad del componente.
 * @param {string} props.message - Mensaje opcional a mostrar junto al spinner.
 * @param {string} props.size - Tamaño del spinner (sm, md, lg).
 */
const LoadingSpinner = ({ message = 'Cargando...', size='md'}) => {
    return (
        <div className="text-center my-5">
            <Spinner animation="border" role="status" size={size}>
                <span className="visually-hidden">{message}</span>
            </Spinner>
            {message && <p className="mt-2 text-muted">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;