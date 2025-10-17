from rest_framework.viewsets import ModelViewSet
from .models import Player
from .serializers import PlayerSerializer

class PlayerViewSet(ModelViewSet):
    queryset = Player.objects.all().order_by('id')
    serializer_class = PlayerSerializer
    lookup_field = 'id'