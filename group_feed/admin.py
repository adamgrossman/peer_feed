from django.contrib import admin
from group_feed.models import Member, Group, Link, Tag, Vote, Comment


admin.site.register(Member)
admin.site.register(Group)
admin.site.register(Link)
admin.site.register(Tag)
admin.site.register(Vote)
admin.site.register(Comment)
