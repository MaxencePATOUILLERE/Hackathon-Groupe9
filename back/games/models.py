from django.db import models
from foosball_tables.models import FoosballTable

class Game(models.Model):
    TEAM = [('Red','Red'), ('Blue','Blue')]

    id = models.CharField(primary_key=True, max_length=10)
    table = models.ForeignKey(FoosballTable, on_delete=models.CASCADE, related_name='games_game')
    game_date = models.CharField(max_length=50, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    score_red = models.IntegerField(default=0)
    score_blue = models.IntegerField(default=0)
    winner_team = models.CharField(max_length=128, choices=TEAM)

    location = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=20, blank=True)
    ball_type = models.CharField(max_length=20, blank=True, null=True)
    music = models.CharField(max_length=50, blank=True, null=True)
    referent = models.CharField(max_length=20, blank=True, null=True)
    attendance = models.IntegerField(null=True, blank=True)
    recorded_by = models.CharField(max_length=20, blank=True)
    rating = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.id