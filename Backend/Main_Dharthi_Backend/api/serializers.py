from rest_framework import serializers
from .models import User, Product, Catalog, CatalogProduct, Transaction, RestockReminder, AILog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalog
        fields = '__all__'

class CatalogProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogProduct
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class RestockReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestockReminder
        fields = '__all__'

class AILogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AILog
        fields = '__all__'
