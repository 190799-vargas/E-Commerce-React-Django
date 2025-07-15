from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display =  ('name', 'parent', 'product_count', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'parent', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'order')
    ordering = ('order', 'name')

    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'slug', 'description', 'parent')
        }),
        ('Apariencia', {
            'fields': ('icon', 'color_class')
        }),
        ('Configuración', {
            'fields': ('is_active', 'order')
        }),
    )
