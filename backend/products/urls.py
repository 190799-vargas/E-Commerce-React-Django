from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('featured/', views.featured_products, name='featured-products'),
    path('search/', views.search_products, name='search-products'),
    path('category/<slug:category_slug>/', views.products_by_category, name='products-by-category'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<int:product_id>/reviews/', views.ProductReviewCreateView.as_view(), name='product-review-create'),
]