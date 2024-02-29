from rest_framework.serializers import ModelSerializer
from .models import Video
from .models import Interaction

class VideoSerializer(ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class InteractionSerializer(ModelSerializer):
    class Meta:
        model = Interaction
        fields = '__all__'