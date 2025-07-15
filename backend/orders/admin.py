from django.contrib import admin
from .models import Order, OrderItem, Cart, CartItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'get_status', 'total_amount', 'created_at')
    list_filter = ('status','created_at')
    search_fields = ('order_number', 'user__username', 'user__email')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'created_at', 'updated_at')

    def get_status(self, obj):
        """Método personalizado para mostrar el estado"""
        return obj.get_status_display() if hasattr(obj, 'get_status_display') else obj.status
    get_status.short_description = 'Estado'

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'total_amount', 'updated_at')
    search_fields = ('user__username', 'user__email')
    inlines = [CartItemInline]