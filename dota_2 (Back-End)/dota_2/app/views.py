from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from .models import Hero, HeroRoles, Aspects, Skills, News, LanguagesData
from .pagination import CustomPagination
from .serializers import HeroSerializer, HeroRolesSerializer, \
    AspectsSerializer, SkillsSerializer, NewsSerializer, SkillsSerializerHero, LanguagesDataSerializer


class NewsViewSet(ReadOnlyModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = CustomPagination

class Parse(APIView):
    def get(self, request):
        from app.seeder.news_loader import new_loader
        new_loader()
        # news = News.objects.all()
        # new = news[0]
        # with open('news.json', 'w') as f:
        #     data = new.data['json_data']['english'] # is str
        #     import json
        #     data = json.loads(data)
        #     json.dump(data, f, indent=4)

        return Response({'status': 'ok'})


class HeroViewSet(ModelViewSet):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer


class HeroListView(ListAPIView):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer
    pagination_class = None


class GetCurrentHero(RetrieveAPIView):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer
    lookup_field = 'name_url'

    @action(detail=True, methods=['get'])
    def get_current_hero(self, request, name):
        hero = Hero.objects.get(name_url=name)
        serializer = HeroSerializer(hero)
        return Response(serializer.data)


class GetCurrentHeroSkills(ListAPIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer

    @action(detail=True, methods=['get'])
    def get_current_hero_skills(self, request, id):
        skills = Skills.objects.filter(hero_id=id)
        serializer = SkillsSerializerHero(skills, many=True)
        print(serializer)
        return Response(serializer.data)



class HeroRolesViewSet(ModelViewSet):
    queryset = HeroRoles.objects.all()
    serializer_class = HeroRolesSerializer
    pagination_class = None

    @action(methods=['get'], detail=True)
    def get_hero_roles(self, request, pk):
        roles = HeroRoles.objects.filter(hero_id=pk)

        serializer = HeroRolesSerializer(roles, many=True)

        return Response(serializer.data)


class AspectsViewSet(ModelViewSet):
    queryset = Aspects.objects.all()
    serializer_class = AspectsSerializer
    pagination_class = None

    @action(detail=True, methods=['get'])
    def get_aspects(self, request, pk):


        aspects = Aspects.objects.filter(hero_id=pk)
        serializer = AspectsSerializer(aspects, many=True)
        return Response(serializer.data)


class SkillsViewSet(ModelViewSet):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    pagination_class = None

    @action(detail=True, methods=['get'])
    def get_skills(self, request, pk):

        skills = Skills.objects.filter(hero_id=pk)
        # print(skills.values('name'))
        # print(skills.__len__())
        serializer = SkillsSerializerHero(skills, many=True)
        return Response(serializer.data)


class LanguagesDataViewSet(ModelViewSet):
    queryset = LanguagesData.objects.all()
    serializer_class = LanguagesDataSerializer
