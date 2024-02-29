# Generated by Django 4.2.4 on 2023-08-17 12:58

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('vid', models.TextField(default=uuid.UUID('c99b4d59-c85a-45c7-bbb2-93411f52dcd5'), primary_key=True, serialize=False)),
                ('title', models.TextField(null=True)),
                ('released', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
