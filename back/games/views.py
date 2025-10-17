from rest_framework import viewsets
from .models import Game
from .serializers import GameSerializer

class GameViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows games to be viewed or edited.
    """
    queryset = Game.objects.all().order_by('id')
    serializer_class = GameSerializer