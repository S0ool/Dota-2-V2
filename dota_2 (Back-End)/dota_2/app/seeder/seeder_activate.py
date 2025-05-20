from app.seeder.news_loader import new_loader


def activate():
    from app.seeder.heroes_loader import get_hero_info
    from app.seeder.load_languages_resource import load_languages_resource
    load_languages_resource()
    get_hero_info()
    new_loader()