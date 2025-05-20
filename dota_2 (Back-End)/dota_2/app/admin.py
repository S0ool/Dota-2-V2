from django.contrib import admin

from app.models import Hero, HeroRoles, Aspects, Skills, News, LanguagesData


# Register your models here.
class HeroAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class NewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'date')



class HeroRolesAdmin(admin.ModelAdmin):
    list_display = ('id', 'hero', 'role')


class AspectsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')


class SkillsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

class LanguagesDataAdmin(admin.ModelAdmin):
    list_display = ('id','language')

admin.site.register(Hero, HeroAdmin)

admin.site.register(LanguagesData,LanguagesDataAdmin)
admin.site.register(HeroRoles, HeroRolesAdmin)
admin.site.register(Aspects, AspectsAdmin)
admin.site.register(Skills, SkillsAdmin)
admin.site.register(News, NewsAdmin)
