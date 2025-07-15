from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem, Cart, CartItem
from products.models import Product
from .serializers import (
    OrderSerializer, CartSerializer, AddToCartSerializer
)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    """Obtener carrito del usuario"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """Agregar producto al carrito"""
    serializer = AddToCartSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response({
            'message': 'Producto agregado al carrito',
            'cart_total': cart.total_items
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    """Actualizar cantidad de producto en carrito"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    quantity = request.data.get('quantity', 1)
    
    if quantity <= 0:
        cart_item.delete()
        return Response({'message': 'Producto eliminado del carrito'})
    
    cart_item.quantity = quantity
    cart_item.save()
    
    return Response({'message': 'Carrito actualizado'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    """Eliminar producto del carrito"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart_item.delete()
    return Response({'message': 'Producto eliminado del carrito'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """Crear orden desde el carrito"""
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Crear la orden
    order_data = request.data.copy()
    order_data['user'] = request.user.id
    order_data['total_amount'] = cart.total_amount
    
    serializer = OrderSerializer(data=order_data)
    if serializer.is_valid():
        order = serializer.save(user=request.user)
        
        # Crear items de la orden
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        # Limpiar carrito
        cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)