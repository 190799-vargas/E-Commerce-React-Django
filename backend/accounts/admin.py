from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_seller', 'is_staff', 'created_at')
    list_filter = ('is_seller', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('phone', 'address', 'city', 'country', 'avatar', 'is_seller')
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'reputation_score', 'total_sales', 'total_purchases')
    list_filter = ('reputation_score',)
    search_fields = ('user_email', 'user_username')