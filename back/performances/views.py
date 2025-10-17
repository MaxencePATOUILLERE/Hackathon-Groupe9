# performances/views.py
from rest_framework import viewsets
from .models import Performance
from .serializers import PerformanceSerializer

class PerformanceViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceSerializer

    def get_queryset(self):
        queryset = Performance.objects.all()
        game = self.request.query_params.get("game")
        if game:
            queryset = queryset.filter(game__id=game)
        return queryset