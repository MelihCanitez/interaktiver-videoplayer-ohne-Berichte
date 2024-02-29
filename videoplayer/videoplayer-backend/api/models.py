from django.db import models
import uuid
import os

# Create your models here.

def video_path(instance, filename):
    # Ordnername mit vid
    folder_name = str(instance.vid)
    return os.path.join(folder_name, filename)


class Video(models.Model):
    vid = models.TextField(primary_key=True, default = uuid.uuid4)
    title = models.TextField(null=True)
    src = models.FileField(upload_to=video_path, null=True)
    released = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class Interaction(models.Model):
    iid = models.TextField(primary_key=True, default = uuid.uuid4)
    duration = models.TextField(null=True)
    type = models.TextField(null=True)
    question = models.TextField(null=True)
    answer1 = models.TextField(null=True)
    answer2 = models.TextField(null=True)
    answer3 = models.TextField(null=True)
    answer4 = models.TextField(null=True)
    realAnswer = models.TextField(null=True)
    videoid = models.ForeignKey(Video, on_delete=models.CASCADE, null=True)