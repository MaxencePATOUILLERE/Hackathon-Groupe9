from django.db import models
from players.models import Player
from games.models import Game

class Performance(models.Model):
    TEAM = [('Red','Red'), ('Blue','Blue')]
    ROLE = [('attack','Attack'), ('defense','Defense')]
    SUBSTITUTE = [('yes','Yes'), ('no','No'), ('maybe','Maybe')]

    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='performances')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='performances')

    team_color = models.CharField(max_length=10, choices=TEAM)
    role = models.CharField(max_length=10, choices=ROLE)
    substitute = models.CharField(max_length=10, choices=SUBSTITUTE, default='no', null=True, blank=True)

    goals = models.IntegerField(default=0)
    own_goals = models.IntegerField(default=0)
    assist = models.IntegerField(default=0)
    save = models.IntegerField(default=0)
    possession_time = models.IntegerField(default=0, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('game', 'player')]

    def __str__(self):
        return f"{self.player} @ {self.game}"