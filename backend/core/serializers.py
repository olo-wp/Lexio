from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserWordList


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'strings')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserWordListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWordList
        fields = ('id', 'name','words')