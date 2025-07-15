from django.db import models
from django.contrib.auth import get_user_model
from categories.models import Category

User = get_user_model()

class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Nuevo'),
        ('used', 'Usado'),
        ('refurbished', 'Reacondicionado'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new')
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True)
    free_shipping = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    views_count = models.IntegerField(default=0)
    sales_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering =  ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['featured', 'is_active']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum([review.rating for review in reviews]) / len(reviews)
        return 0
    
    @property
    def review_count(self):
        return self.reviews.count()
    
    def save(self, *args, **kwargs):
        if self.original_price and self.price:
            self.discount_percentage = int(((self.original_price - self.price) / self.original_price) * 100)
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Imagen de {self.product.title}"

class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"Reseña de {self.user.username} para {self.product.title}"
    
class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}: {self.value}"
