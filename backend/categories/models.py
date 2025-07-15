from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, help_text="Nombre del ícono de Lucide React")
    color_class = models.CharField(max_length=50, help_text="Clases de color de Tailwind")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name
    
    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()

    def get_all_subcategories(self):
        """Obtiene todas las subcategorías de forma recursiva"""
        subcategories = list(self.subcategories.filter(is_active=True))
        for subcategory in self.subcategories.filter(is_active=True):
            subcategories.extend(subcategory.get_all_subcategories())
        return subcategories