from django.contrib import admin
from .models import Player

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'role', 'date_inscription')
    search_fields = ('id', 'name', 'email')
    list_filter = ('role',)