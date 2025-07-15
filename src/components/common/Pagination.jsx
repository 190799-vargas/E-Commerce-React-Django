import { Pagination as BootstrapPagination } from "react-bootstrap";

/**
 * Componente de Paginación reutilizable.
 * @param {object} props - Propiedades del componente.
 * @param {number} props.currentPage - Página actual.
 * @param {number} props.totalPages - Número total de páginas.
 * @param {function} props.onPageChange - Función de callback al cambiar la página.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const items = [];
    const maxPagesToShow = 5; // Número máximo de botones de página a mostrar

    // Lógica para determinar el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow && totalPages > maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Botón Anterior
    items.push(
        <BootstrapPagination.Prev
            key="prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        />
    );

    // Botones de páginas
    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <BootstrapPagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => onPageChange(number)}
            >
                {number}
            </BootstrapPagination.Item>
        );
    }

    // Botón Siguiente
    items.push(
        <BootstrapPagination.Next
            key="next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        />
    );

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="d-flex justify-content-center my-4">
            <BootstrapPagination>{items}</BootstrapPagination>
        </div>
    );
};

export default Pagination;