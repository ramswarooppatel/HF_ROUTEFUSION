from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response    


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


# Login Bypass View
class LoginView(APIView):
    # queryset = User.objects.all()
    def post(self, request, *args, **kwargs):

        print(request.data)
        
        username = request.data.get("username")
        


        user = User.objects.filter(username=username).first()

        if user:
            return Response({'id': user.id}, status=200)

        return Response({'id': 1}, status=200)