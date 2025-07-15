from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category
from .serializers import CategorySerializer, CategoryTreeSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True, parent=None).order_by('order', 'name')
    serializer_class = CategoryTreeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order', 'created_at']
    ordering = ['order', 'name']

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

@api_view(['GET'])
@permission_classes([AllowAny])
def category_tree(request):
    """Devuelve el árbol completo de categorías"""
    categories = Category.objects.filter(is_active=True, parent=None).order_by('order', 'name')
    serializer = CategoryTreeSerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def popular_categories(request):
    """Devuelve las categorías más populares basadas en el número de productos"""
    categories = Category.objects.filter(is_active=True).order_by('-order')[:12]
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)