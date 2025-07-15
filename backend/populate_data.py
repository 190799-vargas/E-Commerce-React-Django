import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mercadolibre_backend.settings')
django.setup()

from categories.models import Category
from products.models import Product, ProductImage
from django.contrib.auth import get_user_model

User = get_user_model()

def create_categories():
    """Crear categorías iniciales"""
    categories_data = [
        {
            'name': 'Tecnología',
            'slug': 'tecnologia',
            'icon': 'Smartphone',
            'color_class': 'bg-blue-100 text-blue-600',
            'description': 'Smartphones, tablets y accesorios tecnológicos'
        },
        {
            'name': 'Hogar',
            'slug': 'hogar',
            'icon': 'Home',
            'color_class': 'bg-green-100 text-green-600',
            'description': 'Muebles, decoración y artículos para el hogar'
        },
        {
            'name': 'Computación',
            'slug': 'computacion',
            'icon': 'Laptop',
            'color_class': 'bg-purple-100 text-purple-600',
            'description': 'Computadoras, laptops y accesorios'
        },
        {
            'name': 'Autos',
            'slug': 'autos',
            'icon': 'Car',
            'color_class': 'bg-red-100 text-red-600',
            'description': 'Vehículos y accesorios automotrices'
        },
        {
            'name': 'Moda',
            'slug': 'moda',
            'icon': 'Shirt',
            'color_class': 'bg-pink-100 text-pink-600',
            'description': 'Ropa, calzado y accesorios de moda'
        },
        {
            'name': 'Gaming',
            'slug': 'gaming',
            'icon': 'Gamepad2',
            'color_class': 'bg-indigo-100 text-indigo-600',
            'description': 'Videojuegos, consolas y accesorios gaming'
        },
        {
            'name': 'Libros',
            'slug': 'libros',
            'icon': 'Book',
            'color_class': 'bg-yellow-100 text-yellow-600',
            'description': 'Libros, revistas y material educativo'
        },
        {
            'name': 'Deportes',
            'slug': 'deportes',
            'icon': 'Dumbbell',
            'color_class': 'bg-orange-100 text-orange-600',
            'description': 'Artículos deportivos y fitness'
        },
        {
            'name': 'Bebés',
            'slug': 'bebes',
            'icon': 'Baby',
            'color_class': 'bg-teal-100 text-teal-600',
            'description': 'Productos para bebés y niños'
        },
        {
            'name': 'Herramientas',
            'slug': 'herramientas',
            'icon': 'Wrench',
            'color_class': 'bg-gray-100 text-gray-600',
            'description': 'Herramientas y equipos de trabajo'
        },
        {
            'name': 'Arte',
            'slug': 'arte',
            'icon': 'Palette',
            'color_class': 'bg-rose-100 text-rose-600',
            'description': 'Materiales artísticos y manualidades'
        },
        {
            'name': 'Regalos',
            'slug': 'regalos',
            'icon': 'Gift',
            'color_class': 'bg-emerald-100 text-emerald-600',
            'description': 'Ideas de regalos para toda ocasión'
        }
    ]

    for i, cat_data in enumerate(categories_data):
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={
                **cat_data,
                'order': i + 1
            }
        )
        if created:
            print(f"Categoría creada: {category.name}")

def create_sample_products():
    """Crear productos de ejemplo"""
    # Crear usuario vendedor si no existe
    seller, created = User.objects.get_or_create(
        email='seller@mercadolibre.com',
        defaults={
            'username': 'seller_oficial',
            'first_name': 'Vendedor',
            'last_name': 'Oficial',
            'is_seller': True
        }
    )

    products_data = [
        {
            'title': 'iPhone 15 Pro 128GB Titanio Natural',
            'slug': 'iphone-15-pro-128gb-titanio-natural',
            'description': 'El iPhone 15 Pro con chip A17 Pro, cámara de 48MP y diseño en titanio.',
            'price': 1299999,
            'original_price': 1599999,
            'category_slug': 'tecnologia',
            'sku': 'IPH15PRO128TN',
            'brand': 'Apple',
            'stock': 50,
            'free_shipping': True,
            'featured': True
        },
        {
            'title': 'Samsung Galaxy S24 Ultra 256GB Phantom Black',
            'slug': 'samsung-galaxy-s24-ultra-256gb-phantom-black',
            'description': 'Galaxy S24 Ultra con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED.',
            'price': 1099999,
            'original_price': 1299999,
            'category_slug': 'tecnologia',
            'sku': 'SGS24U256PB',
            'brand': 'Samsung',
            'stock': 30,
            'free_shipping': True,
            'featured': True
        },
        {
            'title': 'MacBook Air M2 13" 256GB Space Gray',
            'slug': 'macbook-air-m2-13-256gb-space-gray',
            'description': 'MacBook Air con chip M2, pantalla Liquid Retina de 13.6" y hasta 18 horas de batería.',
            'price': 1499999,
            'original_price': 1799999,
            'category_slug': 'computacion',
            'sku': 'MBA13M2256SG',
            'brand': 'Apple',
            'stock': 25,
            'free_shipping': True,
            'featured': True
        },
        {
            'title': 'Nintendo Switch OLED Modelo Neón',
            'slug': 'nintendo-switch-oled-modelo-neon',
            'description': 'Nintendo Switch con pantalla OLED de 7", colores vibrantes y audio mejorado.',
            'price': 389999,
            'original_price': 449999,
            'category_slug': 'gaming',
            'sku': 'NSW-OLED-NEON',
            'brand': 'Nintendo',
            'stock': 40,
            'free_shipping': True,
            'featured': True
        },
        {
            'title': 'Zapatillas Nike Air Max 270 Unisex',
            'slug': 'zapatillas-nike-air-max-270-unisex',
            'description': 'Zapatillas Nike Air Max 270 con amortiguación Air visible y diseño moderno.',
            'price': 159999,
            'original_price': 199999,
            'category_slug': 'deportes',
            'sku': 'NIKE-AM270-UNI',
            'brand': 'Nike',
            'stock': 100,
            'free_shipping': True,
            'featured': False
        }
    ]

    for product_data in products_data:
        category = Category.objects.get(slug=product_data.pop('category_slug'))
        
        product, created = Product.objects.get_or_create(
            slug=product_data['slug'],
            defaults={
                **product_data,
                'category': category,
                'seller': seller
            }
        )
        
        if created:
            print(f"Producto creado: {product.title}")

if __name__ == '__main__':
    print("Poblando base de datos...")
    create_categories()
    create_sample_products()
    print("¡Base de datos poblada exitosamente!")