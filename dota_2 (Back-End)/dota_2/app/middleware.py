from django.contrib.auth.models import User
from django.db import connection
from django.core.management import call_command
from django.db.utils import OperationalError


class CheckMigrationsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.migrations_checked = False

    def __call__(self, request):
        if not self.migrations_checked:
            self.check_and_apply_migrations()
            self.migrations_checked = True
        response = self.get_response(request)
        return response

    def check_and_apply_migrations(self):
        try:
            connection.ensure_connection()

            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM django_migrations")
                migrations_exist = cursor.fetchone()[0] > 0

        except OperationalError:
            migrations_exist = False

        if not migrations_exist:
            print("Миграции не применены. Создание и выполнение миграций...")
            call_command('makemigrations')
            call_command('migrate')
            call_command('createsuperuser', username='admin', email='admin@example.com', interactive=False)
            user = User.objects.get(username='admin')
            user.set_password('111')
            user.save()

            self.populate_initial_data()

    def populate_initial_data(self):
        from app.seeder.seeder_activate import activate

        print('ПОЖАЛУЙСТА ПОДОЖДИТЕ ПОКА ДАННЫЕ ГРУЗЯТСЯ...')

        activate()