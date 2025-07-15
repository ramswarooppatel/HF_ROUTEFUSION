from rest_framework import viewsets
from .models import User, Product, Catalog, CatalogProduct, Transaction, RestockReminder, AILog
from .serializers import (
    UserSerializer, ProductSerializer, CatalogSerializer, CatalogProductSerializer,
    TransactionSerializer, RestockReminderSerializer, AILogSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer

class CatalogViewSet(viewsets.ModelViewSet):
    queryset = Catalog.objects.all().order_by('-id')
    serializer_class = CatalogSerializer

class CatalogProductViewSet(viewsets.ModelViewSet):
    queryset = CatalogProduct.objects.all().order_by('-id')
    serializer_class = CatalogProductSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-id')
    serializer_class = TransactionSerializer

class RestockReminderViewSet(viewsets.ModelViewSet):
    queryset = RestockReminder.objects.all().order_by('-id')
    serializer_class = RestockReminderSerializer

class AILogViewSet(viewsets.ModelViewSet):
    queryset = AILog.objects.all().order_by('-id')
    serializer_class = AILogSerializer
