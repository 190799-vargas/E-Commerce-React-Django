from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.throttling import UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Product, ProductReview
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    ProductCreateSerializer, ProductReviewSerializer
)
from .filters import ProductFilter

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['title', 'description', 'brand', 'model']
    ordering_fields = ['price', 'created_at', 'sales_count', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category', 'seller')

        # Validación de precios
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price and max_price and float(min_price) > float(max_price):
            raise ValidationError("El precio mínimo no puede ser mayor al máximo")
        
        # Filtro por categoría
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)


        # Filtro por precio
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Filtro por condición
        condition = self.request.query_params.get('condition')
        if condition:
            queryset = queryset.filter(condition=condition)

        # Filtro por envío gratis
        free_shipping = self.request.query_params.get('free_shipping')
        if free_shipping == 'true':
            queryset = queryset.filter(free_shipping=True)
        
        return queryset
    
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrementar contador de vistas
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([AllowAny])
def featured_products(request):
    """Productos destacados"""
    products = Product.objects.filter(is_active=True, featured=True)[:8]
    serializer = ProductListSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_category(request, category_slug):
    """Productos por categoría"""
    products = Product.objects.filter(
        is_active=True,
        category__slug=category_slug
    ).order_by('-created_at')[:20]
    serializer = ProductListSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_products(request):
    """Búsqueda de productos"""
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query),
            is_active=True
        ).order_by('-created_at')
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    return Response([])

class ProductReviewCreateView(generics.CreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        if ProductReview.objects.filter(
            user=self.request.user,
            product_id=product_id
        ).exists():
            raise ValidationError({"detail": "Ya has reseñado este producto"})
        
        serializer.save(user=self.request.user, product_id=product_id)
