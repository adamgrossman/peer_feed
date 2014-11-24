from rest_framework.authtoken.models import Token
from group_feed.models import Member

# Probably want to put this in a function and not have it run globally
for member in Member.objects.all():
    Token.objects.get_or_create(user=member)
