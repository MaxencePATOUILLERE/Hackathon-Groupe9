"""
URL configuration for back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter

from foosball_tables.views import FoosballTableViewSet
from games.views import GameViewSet
from performances.views import PerformanceViewSet
from players.views import PlayerViewSet


router = DefaultRouter()
router.register('players', PlayerViewSet, basename='players')
router.register("players", PlayerViewSet)
router.register("games", GameViewSet)
router.register("foosball-tables", FoosballTableViewSet)
router.register(r'performances', PerformanceViewSet, basename='performance')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
