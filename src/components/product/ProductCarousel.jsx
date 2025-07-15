import { Carousel } from "react-bootstrap";

/**
 * /**
 * Muestra las imágenes de un producto en un carrusel.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.images - Array de objetos de imágenes ({ id, image_url }).
 * @param {string} props.title - Título del producto (para el alt text).
 */
const ProductCarousel = ({ images, title }) => {
    if (!images || images.length === 0) {
        return (
            <img
                className="d-block w-100"
                src="https://via.placeholder.com/600x400?text=Imagen+No+Disponible"
                alt="Imagen no disponible"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
        );
    }

    return (
        <Carousel fade>
            {images.map((image) => (
                <Carousel.Item key={image.id}>
                    <img
                        className="d-block w-100"
                        src={image.image_url}
                        alt={title}
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;