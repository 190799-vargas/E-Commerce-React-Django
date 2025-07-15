from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.conf import settings

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Solución para los conflictos
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="mercado_user_groups",  # Nombre único
        related_query_name="mercado_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="mercado_user_permissions",  # Nombre único
        related_query_name="mercado_user",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'auth_user'  # Mantener compatibilidad
        swappable = 'AUTH_USER_MODEL'

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    birth_date = models.DateField(blank=True, null=True)
    reputation_score = models.IntegerField(default=0)
    total_sales = models.IntegerField(default=0)
    total_purchases = models.IntegerField(default=0)

    def __str__(self):
        return f"Perfil de {self.user.email}"