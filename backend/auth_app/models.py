# auth_app/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Agrega campos personalizados aquí si es necesario
    pass
