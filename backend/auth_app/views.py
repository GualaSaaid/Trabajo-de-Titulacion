from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({"message": "Credenciales exitosas. ¡Bienvenido!"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Error en las credenciales."}, status=status.HTTP_400_BAD_REQUEST)

