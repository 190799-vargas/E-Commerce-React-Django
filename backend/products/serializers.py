from rest_framework import serializers
from .models import Product, ProductImage, ProductReview, ProductAttribute
from categories.serializers import CategorySerializer
from accounts.serializers import UserSerializer

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name', 'value']

class ProductReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'price', 'original_price', 'discount_percentage',
            'primary_image', 'free_shipping', 'average_rating', 'review_count',
            'category_name', 'seller_name', 'condition', 'stock', 'featured'
        ]

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ['seller', 'views_count', 'sales_count']

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)
