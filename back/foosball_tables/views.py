from rest_framework import viewsets, filters
from .models import FoosballTable
from .serializers import FoosballTableSerializer

class FoosballTableViewSet(viewsets.ModelViewSet):
    queryset = FoosballTable.objects.all().order_by("table_id")  # <-- ici
    serializer_class = FoosballTableSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["table_id", "name"]
    ordering_fields = ["table_id", "name", "status"]
    ordering = ["table_id"]