from django.contrib import admin
from .models import Product, ProductImage, ProductReview, ProductAttribute

class  ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'seller', 'price', 'stock', 'is_active', 'featured', 'created_at')
    list_filter = ('category', 'condition', 'free_shipping', 'featured', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'sku', 'brand')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_active', 'featured', 'price', 'stock')
    inlines = [ProductImageInline, ProductAttributeInline]

    fieldsets = (
        ('Información básica', {
            'fields': ('title', 'slug', 'description', 'category', 'seller')
        }),
        ('Precios y descuentos', {
            'fields': ('price',  'original_price', 'discount_percentage')
        }),
        ('Detalles del producto', {
            'fields': ('condition', 'stock', 'sku', 'brand', 'model', 'weight', 'dimensions')
        }),
        ('Configuración', {
            'fields': ('free_shipping', 'featured', 'is_active')
        }),
    )

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__title', 'user__username', 'comment')