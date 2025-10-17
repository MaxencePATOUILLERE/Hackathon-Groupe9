from django.db import models
from django.contrib.auth.hashers import make_password

class Player(models.Model):
    ROLE_CHOICES = [
        ('utilisateur', 'Utilisateur'),
        ('admin', 'Admin'),
    ]

    id = models.CharField(primary_key=True, max_length=20)

    name = models.CharField(max_length=128)
    age = models.IntegerField(null=True, blank=True)
    email = models.CharField(max_length=50)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='utilisateur')
    date_inscription = models.DateField(auto_now_add=True)

    password = models.CharField(max_length=128)

    def set_password(self, raw_password: str):
        self.password = make_password(raw_password)

    def __str__(self):
        return f"{self.id} - {self.name}"