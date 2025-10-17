from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Player

class PlayerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Player
        fields = ['id', 'name', 'age', 'email', 'role', 'date_inscription', 'password']
        read_only_fields = ['date_inscription']

    def create(self, validated_data):
        pwd = validated_data.pop('password')
        player = Player(**validated_data)
        player.password = make_password(pwd)
        player.save()
        return player

    def update(self, instance, validated_data):
        pwd = validated_data.pop('password', None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if pwd:
            instance.password = make_password(pwd)
        instance.save()
        return instance