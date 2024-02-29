from django.contrib import admin

# Register your models here.

from .models import Video
from .models import Interaction

admin.site.register(Video)
admin.site.register(Interaction)