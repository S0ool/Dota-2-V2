from rest_framework import serializers
from .models import Hero, HeroRoles, Aspects, Skills, News, LanguagesData


class HeroIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ['id']


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'


class HeroSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hero
        fields = '__all__'




class HeroRolesSerializer(serializers.ModelSerializer):
    hero = HeroIdSerializer(read_only=True)

    class Meta:
        model = HeroRoles
        fields = '__all__'


class AspectsSerializer(serializers.ModelSerializer):
    hero = HeroIdSerializer(read_only=True)

    class Meta:
        model = Aspects
        fields = '__all__'


class SkillsSerializerHero(serializers.ModelSerializer):
    hero = HeroIdSerializer(read_only=True)

    class Meta:
        model = Skills
        fields = '__all__'


class SkillsSerializer(serializers.ModelSerializer):
    hero = HeroSerializer(read_only=True)

    class Meta:
        model = Skills
        fields = '__all__'

class LanguagesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguagesData
        fields = '__all__'