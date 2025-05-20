from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
    verbose_name = 'Dota 2'
# мб проверять, если нет базы данных, то создать их и сразу заполнить его
    # def ready(self):
    #     import app.signals # Импортируем сигналы, если они используются
