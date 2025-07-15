# Plataforma E-Commerce - Guía de Instalación y Configuración

## Descripción
Este es un clon completo de MercadoLibre desarrollado con React + TypeScript en el frontend y Django + PostgreSQL en el backend.

## Tecnologías Utilizadas

### Frontend
- React 19
- Bootstrap
- Lucide React (iconos)
- Vite (build tool)
- axios
- jwt Decode
- React Bootstrap
- React Router Dom
- React Toastify
- sass


### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Django CORS Headers

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **Python** (versión 3.8 o superior)
- **PostgreSQL** (versión 12 o superior)
- **pip** (gestor de paquetes de Python)
- **npm** o **yarn** (gestor de paquetes de Node.js)

## Configuración del Backend (Django)

### 1. Crear entorno virtual de Python

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

### 2. Instalar dependencias de Python

```bash
# Instalar todas las dependencias
pip install -r requirements.txt
```

### 3. Configurar PostgreSQL

```bash
# Conectarse a PostgreSQL como superusuario
psql -U postgres

# Crear base de datos
CREATE DATABASE mercadolibre_db;

# Crear usuario
CREATE USER mercadolibre_user WITH PASSWORD 'tu_password_aqui';

# Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE mercadolibre_db TO mercadolibre_user;

# Salir de PostgreSQL
\q
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

### 5. Ejecutar migraciones

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 6. Poblar base de datos con datos de ejemplo

```bash
# Ejecutar script de población
python populate_data.py
```

### 7. Iniciar servidor de desarrollo

```bash
# Iniciar servidor Django
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

## Configuración del Frontend (React)

### 1. Instalar dependencias de Node.js

```bash
# Desde el directorio raíz del proyecto
npm install
```

### 2. Configurar variables de entorno

El archivo `.env.local` ya está configurado con:
```
VITE_API_URL=http://localhost:8000/api
```

### 3. Iniciar servidor de desarrollo

```bash
# Iniciar servidor de desarrollo de Vite
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## Comandos Útiles

### Backend (Django)

```bash
# Activar entorno virtual
source venv/bin/activate  # macOS/Linux
# o
venv\Scripts\activate     # Windows

# Crear nueva migración
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Acceder al shell de Django
python manage.py shell

# Recopilar archivos estáticos
python manage.py collectstatic
```

### Frontend (React)

```bash
# Instalar nueva dependencia
npm install nombre-paquete

# Ejecutar linter
npm run lint

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Estructura del Proyecto

```
mercadolibre-clone/
├── backend/                 # Backend Django
│   ├── accounts/           # App de usuarios
│   ├── categories/         # App de categorías
│   ├── products/          # App de productos
│   ├── orders/            # App de órdenes y carrito
│   ├── mercadolibre_backend/  # Configuración principal
│   ├── requirements.txt   # Dependencias Python
│   └── manage.py         # Script de gestión Django
├── frontend/
│    ├── src/                   # Frontend React
│    │   ├── components/       # Componentes React
│    │   ├── hooks/           # Custom hooks
│    │   ├── services/        # Servicios API
│    │   └── main.tsx        # Punto de entrada
├── package.json         # Dependencias Node.js
└── README.md           # Este archivo
```

## Funcionalidades Implementadas

### Backend
- ✅ Sistema de autenticación con JWT
- ✅ Gestión de usuarios y perfiles
- ✅ Categorías jerárquicas
- ✅ Productos con imágenes y atributos
- ✅ Sistema de carrito de compras
- ✅ Gestión de órdenes
- ✅ Sistema de reseñas
- ✅ API REST completa
- ✅ Panel de administración Django

### Frontend
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Carrusel de ofertas
- ✅ Navegación por categorías
- ✅ Búsqueda de productos
- ✅ Filtros avanzados
- ✅ Carrito de compras
- ✅ Sistema de favoritos
- ✅ Diseño moderno y atractivo

## Solución de Problemas Comunes

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Reiniciar PostgreSQL si es necesario
sudo service postgresql restart
```

### Error de CORS en el frontend
- Verificar que `django-cors-headers` esté instalado
- Comprobar configuración en `settings.py`
- Asegurar que el backend esté ejecutándose en el puerto 8000

### Error de dependencias
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

## Desarrollo

### Para agregar nuevas funcionalidades:

1. **Backend**: Crear nuevas apps Django o extender las existentes
2. **Frontend**: Agregar componentes en `src/components/`
3. **API**: Extender servicios en `src/services/api.ts`

### Para personalizar el diseño:
- Modificar clases de Tailwind CSS en los componentes
- Agregar nuevos iconos de Lucide React
- Personalizar colores en `tailwind.config.js`

## Contribución

1. Fork el proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request


## Licencia

### Autor
Victor Alfonso Vargas Diaz

Este proyecto es de código abierto y está disponible bajo la licencia MIT.