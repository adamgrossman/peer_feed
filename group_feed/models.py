from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from mptt.managers import TreeManager
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey
from rest_framework.authtoken.models import Token
from merge import settings


class Member(AbstractUser):
    profile_photo = models.ImageField(upload_to='member_photos', blank=True, null=True)
    bio = models.TextField(max_length=300)

    def __unicode__(self):
        return self.username

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)


class Group(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    member = models.ManyToManyField(Member, related_name="group_members")

    def __unicode__(self):
        return self.title


class Link(models.Model):
    url = models.URLField()
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    flag = models.IntegerField(default=0)
    star = models.ForeignKey(Member, blank=True, null=True, related_name="link_star")
    posted_user = models.ForeignKey(Member, related_name="link_members")
    group = models.ForeignKey(Group, related_name="link_group")

    def __unicode__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=50)
    link = models.ManyToManyField(Link, related_name="tags")

    def __unicode__(self):
        return self.name


class Vote(models.Model):
    up_vote = models.BooleanField(default=True)
    voter = models.ForeignKey(Member, related_name="vote_member")
    link = models.ForeignKey(Link, related_name="vote_link")

    def __unicode__(self):
        return u'{} voted on: {}'.format(self.voter.username, self.link.title)


class Comment(MPTTModel):
    all_objects = TreeManager()

    body = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    # rating = models.IntegerField(default=0)
    author = models.ForeignKey(Member, related_name="comment_authors")
    link = models.ForeignKey(Link, related_name="comment_links")
    parent = TreeForeignKey('self', blank=True, null=True, related_name="children")

    def __unicode__(self):
        return u'{} by {}'.format(self.body, self.author.username)
