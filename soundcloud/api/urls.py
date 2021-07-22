from django.urls import path
from .views import CommentView, CreateComment

urlpatterns = [
    path('get/', CommentView.as_view()),
    path('post/', CreateComment.as_view()),
]