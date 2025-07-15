from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.ReadOnlyField()
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color_class', 'parent', 'product_count', 'subcategories', 'is_active', 'order']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.filter(is_active=True), many=True).data
        return []

class CategoryTreeSerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    product_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color_class', 'product_count', 'subcategories']

    def get_subcategories(self, obj):
        subcategories = obj.subcategories.filter(is_active=True).order_by('order', 'name')
        return CategoryTreeSerializer(subcategories, many=True).data