from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    ROLE_CHOICES = [
        ('kirana', 'Kirana'),
        ('artisan', 'Artisan'),
        ('farmer', 'Farmer'),
    ]
    phone = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_qty = models.IntegerField()
    image_url = models.URLField(blank=True, null=True)
    qr_code_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)

class Catalog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='catalogs')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    qr_code_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CatalogProduct(models.Model):
    catalog = models.ForeignKey(Catalog, on_delete=models.CASCADE, related_name='catalog_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='catalog_products')

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    payment_link = models.URLField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class RestockReminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restock_reminders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='restock_reminders')
    suggested_qty = models.IntegerField()
    season_note = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class AILog(models.Model):
    ACTION_CHOICES = [
        ('image_detection', 'Image Detection'),
        ('voice', 'Voice Command'),
        ('stock_update', 'Stock Update'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_logs')
    action_type = models.CharField(max_length=50, choices=ACTION_CHOICES)
    input_data = models.JSONField()
    ai_output = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)