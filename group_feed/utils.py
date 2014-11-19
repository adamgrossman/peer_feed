from rest_framework.authtoken.models import Token
from group_feed.models import Member

for member in Member.objects.all():
    Token.objects.get_or_create(user=member)
