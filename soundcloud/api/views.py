from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CommentSerializer, CreateCommentSerializer
from .models import Comment
from rest_framework.views import APIView
from rest_framework.response import Response

class CommentView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CreateComment(APIView):
    serializer_class = CreateCommentSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get('username')
            timestamp = serializer.data.get('timestamp')
            content = serializer.data.get('content')

            comment = Comment(username=username,
                timestamp=timestamp,
                content=content
            )
            comment.save()

            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
