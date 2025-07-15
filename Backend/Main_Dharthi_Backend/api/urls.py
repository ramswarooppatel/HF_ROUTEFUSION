from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'catalogs', views.CatalogViewSet)
router.register(r'catalog-products', views.CatalogProductViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'restock-reminders', views.RestockReminderViewSet)
router.register(r'ai-logs', views.AILogViewSet)
# router.register(r'login', views.LoginView.as_view())

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
]
