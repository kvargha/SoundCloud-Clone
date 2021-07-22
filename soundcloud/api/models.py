from django.db import models

# Create your models here.
class Comment(models.Model):
    username = models.CharField(max_length=120)
    timestamp = models.CharField(max_length=5)
    date_created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()