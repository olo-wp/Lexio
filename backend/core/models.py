from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class UserWordList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userString')
    name = models.CharField(max_length=63)
    words = ArrayField(models.CharField(max_length=63), blank=True, default=list)

    def __str__(self):
        return f"{self.name} ({self.user})"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='unique_word_lists')
        ]