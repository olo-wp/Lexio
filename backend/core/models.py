from django.db import models


# Create your models here.

class Nigga(models.Model):
    name = models.CharField(max_length=255)
    isSubscribed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name) + str(self.isSubscribed)
