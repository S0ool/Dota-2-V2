# Generated by Django 5.0.6 on 2025-05-18 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_news_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='content',
            field=models.JSONField(default={}),
        ),
        migrations.AlterField(
            model_name='news',
            name='data',
            field=models.JSONField(default={}),
        ),
        migrations.AlterField(
            model_name='news',
            name='date',
            field=models.JSONField(default={}),
        ),
        migrations.AlterField(
            model_name='news',
            name='title',
            field=models.JSONField(default={}),
        ),
    ]
