from django.urls import path
from . import views

urlpatterns = [
    path('', views.CategoryListView.as_view(), name='category-list'),
    path('tree/', views.category_tree, name='category-tree'),
    path('popular/', views.popular_categories, name='popular-categories'),
    path('<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
]