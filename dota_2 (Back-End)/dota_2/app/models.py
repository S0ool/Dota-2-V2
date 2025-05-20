from django.db import models

class LanguagesData(models.Model):
    language = models.CharField(max_length=100)
    data = models.JSONField()
    attributes_img = models.JSONField(
        default={
            "hero_strength":'hero_strength.png',
            "hero_agility":'hero_agility.png',
            "hero_intelligence":'hero_intelligence.png',
            "hero_universal":'hero_universal.png'
        }
    )

    def __str__(self):
        return self.language


class News(models.Model):
    title = models.JSONField(default={})
    content = models.JSONField(default={})
    date = models.JSONField(default={})
    data = models.JSONField(default={})

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = 'News'
        verbose_name_plural = 'News'


# Create your models here.
class DatabaseState(models.Model):
    is_data_loaded = models.BooleanField(default=False)

    def __str__(self):
        return "Загружены ли данные: " + str(self.is_data_loaded)


class Hero(models.Model):
    name = models.JSONField()
    name_url = models.CharField(max_length=2222, null=True, blank=True)
    MAIN_ATTRIBUTE_CHOICES = [
        ('hero_strength', 'Strength'),
        ('hero_agility', 'Agility'),
        ('hero_intelligence', 'Intelligence'),
        ('hero_universal', 'Universal'),
    ]
    main_attribute = models.CharField(max_length=100,choices=MAIN_ATTRIBUTE_CHOICES)
    complexity = models.PositiveSmallIntegerField()
    advice = models.JSONField()
    history = models.JSONField()
    attack = models.JSONField()
    defense = models.JSONField()
    mobility = models.JSONField()
    hp = models.JSONField()
    mp = models.JSONField()
    attributes = models.JSONField()
    ATTACK_TYPE_CHOICES = [
        ('hero_attack_type_melee', 'melee'),
        ('hero_attack_type_ranged', 'ranged'),
    ]
    attack_type = models.CharField(max_length=100, choices=ATTACK_TYPE_CHOICES) #
    talents = models.JSONField()
    description = models.JSONField()
    video = models.CharField(max_length=2222, null=True, blank=True)
    image = models.CharField(max_length=2222, null=True, blank=True)
    icon = models.CharField(max_length=2222, null=True, blank=True)

    def __str__(self):
        return self.image

    class Meta:
        verbose_name = 'Hero'
        verbose_name_plural = 'Heroes'


class HeroRoles(models.Model):
    ROLES = [
        ('hero_carry', 'Carry'),
        ('hero_support', 'Support'),
        ('hero_nuker', 'Nuker'),
        ('hero_disabler', 'Disabler'),
        ('hero_jungler', 'Jungler'),
        ('hero_durable', 'Durable'),
        ('hero_escape', 'Escape'),
        ('hero_pusher', 'Pusher'),
        ('hero_initiator', 'Initiator')
    ]
    role = models.CharField(max_length=100,choices=ROLES)
    hero = models.ForeignKey(Hero, on_delete=models.CASCADE)
    LEVELS = [(i, str(i)) for i in range(4)]
    level = models.PositiveSmallIntegerField(choices=LEVELS)

    def __str__(self):
        return f'{self.hero}. Role_id:{self.role} - LVL:{self.level}'


    class Meta:
        verbose_name = 'Hero role'
        verbose_name_plural = 'Hero roles'


class Aspects(models.Model):
    title = models.JSONField()
    description = models.JSONField(null=True, blank=True)
    icon = models.CharField(max_length=2222, null=True, blank=True)
    ability_description = models.JSONField(null=True, blank=True)
    ability_name = models.CharField(max_length=100, null=True, blank=True)
    ability_icon = models.CharField(max_length=2222, null=True, blank=True)
    full_description = models.JSONField(null=True, blank=True)
    hero = models.ForeignKey(Hero, on_delete=models.CASCADE, null=True, blank=True)
    facet_bonuses = models.JSONField(null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    def __str__(self):
        return self.icon

    class Meta:
        verbose_name = 'Aspect'
        verbose_name_plural = 'Aspects'


class Skills(models.Model):
    name = models.JSONField()
    icon = models.CharField(max_length=2222, null=True, blank=True)
    number = models.PositiveSmallIntegerField()
    description = models.JSONField()
    cooldown = models.CharField(max_length=100)
    mana_cost = models.CharField(max_length=100)
    spell_effects = models.JSONField()
    video = models.CharField(max_length=2222, null=True, blank=True)
    hero = models.ForeignKey(Hero, on_delete=models.CASCADE)
    tip = models.JSONField(null=True, blank=True)
    is_innate = models.BooleanField(default=False)
    ability_is_granted_by_shard = models.BooleanField(default=False)
    ability_is_granted_by_scepter = models.BooleanField(default=False)
    ability_has_scepter = models.BooleanField(default=False)
    ability_has_shard = models.BooleanField(default=False)
    scepter_description = models.JSONField(blank=True, null=True)
    shard_description = models.JSONField(blank=True, null=True)
    aghs_icon = models.CharField(max_length=2222, null=True, blank=True)
    is_facet = models.BooleanField(default=False)

    def clean_video_url(self):
        """Удаляет только дефис '-' из имени героя в поле video."""
        if self.video:
            parts = self.video.split('/abilities/')
            if len(parts) > 1:
                # Получаем часть после 'abilities/' и заменяем '-' на ''
                hero_part = parts[1].split('/')[0].replace('-', '')
                # Собираем обновленный URL
                self.video = parts[0] + '/abilities/' + hero_part + '/' + '/'.join(parts[1].split('/')[1:])
        return self.video

    def __str__(self):
        return self.aghs_icon

    class Meta:
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'



