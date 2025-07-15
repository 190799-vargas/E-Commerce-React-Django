from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('cart/', views.get_cart, name='get-cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/items/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/items/<int:item_id>/remove/', views.remove_from_cart, name='remove-from-cart'),
    path('create/', views.create_order, name='create-order'),
]