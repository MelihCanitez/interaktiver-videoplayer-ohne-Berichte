from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Video
from .serializers import VideoSerializer
from .models import Interaction
from .serializers import InteractionSerializer

import os
from django.conf import settings
from django.http import JsonResponse

import subprocess

from django.views.decorators.csrf import csrf_exempt

from glob import glob
import shutil

# Create your views here.

@api_view(["GET", "POST"])
def getRoutes(request):

    routes = [{
            "Endpoint": "/video",
            "method": "GET, POST",
            "description": "Show or Create Video"
        },
        {
            "Endpoint": "/video/vid",
            "method": "GET, POST, PUT, DELETE",
            "description": "Show or Create ONE Video"
        },
        {
            "Endpoint": "/interaction",
            "method": "GET, POST",
            "description": "Show or Create Interaction"
        },
        {
            "Endpoint": "/interaction/iid",
            "method": "GET, POST, PUT, DELETE",
            "description": "Show or Create ONE Interaction"
        },
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
def getVideos(request):
    if request.method == 'GET':
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
    else:
        data = request.data
        createVideo = Video.objects.create(title = data['title'], src = data['src'])
        serializer = VideoSerializer(createVideo, many = False)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def getVideo(request, vid):
    try:
        video = Video.objects.get(vid=vid)
    except Video.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VideoSerializer(video)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = VideoSerializer(video, data=request.data)

        if serializer.is_valid():
            # Get the new title
            # new_title = serializer.validated_data.get('title')

            # m3u8 with new title
            # m3u8_file_path = os.path.join(settings.MEDIA_ROOT, f'{video.title}.m3u8')
            # with open(m3u8_file_path, "r") as m3u8_file:
            #     m3u8_content = m3u8_file.read()
            #     new_m3u8_content = m3u8_content.replace(video.title, new_title)
            # with open(m3u8_file_path, "w") as m3u8_file:
            #     m3u8_file.write(new_m3u8_content)

            # Rename the files in the media folder
            # file_paths = glob(os.path.join(settings.MEDIA_ROOT, f'*{video.title}*'))
            # for file_path in file_paths:
            #     # Construct the new file path with the new title
            #     new_file_path = file_path.replace(video.title, new_title)
            #     os.rename(file_path, new_file_path)

            # Update the video title
            
            # video.src = new_title + ".mp4"

            video.title = serializer.validated_data.get('title') #new_title

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        #Liste erstellen
        # file_paths = glob(os.path.join(settings.MEDIA_ROOT, f'*{video.title}*'))

        # for file_path in file_paths:
        #     os.remove(file_path)

        folder_path = os.path.join(settings.MEDIA_ROOT, str(video.vid))
        shutil.rmtree(folder_path) #os.remove für einzelne Dateien und shutil für Ordner
        
        video.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
def getInteractions(request):
    if request.method == 'GET':
        interactions = Interaction.objects.all()
        serializer = InteractionSerializer(interactions, many=True)
        return Response(serializer.data)
    else:
        data = request.data
        try:
            video = Video.objects.get(vid=data['videoid'])
        except Video.DoesNotExist:
            return Response({'error': 'Video not found.'}, status=status.HTTP_404_NOT_FOUND)
        createInteraction = Interaction.objects.create(duration = data['duration'], type = data['type'], question = data['question'], answer1 = data['answer1'], answer2 = data['answer2'], answer3 = data['answer3'], answer4 = data['answer4'], realAnswer = data['realAnswer'], videoid = video)
        serializer = InteractionSerializer(createInteraction, many = False)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def getInteraction(request, iid):
    try:
        interaction = Interaction.objects.get(iid=iid)
    except Video.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InteractionSerializer(interaction)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = InteractionSerializer(interaction, data=request.data)

        if serializer.is_valid():
            interaction.duration = serializer.validated_data.get('duration') #edit duration

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        interaction.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def list_media(request):
    media_root = settings.MEDIA_ROOT
    files = []

    for root, _, file_names in os.walk(media_root):
        for file_name in file_names:
            file_path = os.path.join(root, file_name)
            relative_path = os.path.relpath(file_path, media_root)
            files.append(relative_path)

    return JsonResponse({'files': files})

@api_view(['POST'])
@csrf_exempt
def execute_convert(request):
    try:
        video_name = request.POST.get('video_name')[7:]
        
        video_path = os.path.abspath(os.path.join(settings.MEDIA_ROOT, video_name))
        
        output_playlist = f'{video_name[:-4]}.m3u8'
        output_playlist_path = os.path.abspath(os.path.join(settings.MEDIA_ROOT, output_playlist))
        
        ffmpeg_command = f'ffmpeg -i "{video_path}" -c:v copy -c:a copy -hls_time 10 -hls_list_size 0 "{output_playlist_path}"'

        result = subprocess.check_output(ffmpeg_command, shell=True, stderr=subprocess.STDOUT)
        
        return JsonResponse({'output': result.decode('utf-8')})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)