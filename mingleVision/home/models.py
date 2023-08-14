from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Room(models.Model):
    Room_Name = models.CharField(max_length=122)
    Room_Code = models.CharField(max_length=122)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.Room_Name