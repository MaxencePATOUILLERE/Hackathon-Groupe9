from django.db import models

class FoosballTable(models.Model):
    STATUS = [('available','Available'), ('in_use','In use'), ('maintenance','Maintenance')]

    table_id = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS, default='available')
    condition_state = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.id} ({self.status})"