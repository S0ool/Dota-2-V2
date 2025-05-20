from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.routers import SimpleRouter
from django.urls import path, include, re_path
from .views import HeroViewSet, HeroRolesViewSet, AspectsViewSet, \
    SkillsViewSet, NewsViewSet, HeroListView, GetCurrentHero, GetCurrentHeroSkills, Parse, LanguagesDataViewSet

router = SimpleRouter()
router.register(r'heroes', HeroViewSet, basename='hero')
router.register(r'hero-roles', HeroRolesViewSet, basename='hero-role')
router.register(r'aspects', AspectsViewSet, basename='aspect')
router.register(r'skills', SkillsViewSet, basename='skill')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'languages', LanguagesDataViewSet, basename='languages')
schema_view = get_schema_view(
    openapi.Info(
        title="Ruslan Fans",
        default_version="v1",
        description="Ruslan Fans API",
    ),
    public=True,
    permission_classes=([permissions.AllowAny]),
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),

    path("", include(router.urls)),

    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    path('heroes-list/', HeroListView.as_view()),
    path('hero/<str:name_url>/', GetCurrentHero.as_view()),
    path('hero-skill/<int:id>/', GetCurrentHeroSkills.as_view()),
    path('parse/', Parse.as_view()),
]
