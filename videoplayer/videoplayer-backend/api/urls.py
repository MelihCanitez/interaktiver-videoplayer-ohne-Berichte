from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('video/', views.getVideos, name="videos"),
    path('video/<uuid:vid>/', views.getVideo, name="video"),
    path('interaction/', views.getInteractions, name="interactions"),
    path('interaction/<uuid:iid>/', views.getInteraction, name="interaction"),
    path('media/', views.list_media, name='media'),
    path('executeconvert/', views.execute_convert, name='executeconvert')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)