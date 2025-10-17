from rest_framework import serializers
from .models import FoosballTable

class FoosballTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoosballTable
        fields = '__all__'