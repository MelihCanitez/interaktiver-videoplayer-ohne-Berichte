# Generated by Django 4.2.4 on 2023-08-21 09:32

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_video_vid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='vid',
            field=models.TextField(default=uuid.uuid4, primary_key=True, serialize=False),
        ),
    ]
