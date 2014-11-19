from django.contrib.auth import authenticate, login as django_login
from rest_framework import viewsets, status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from group_feed.api.serializers import MemberSerializer, LinkSerializer, GroupSerializer
from group_feed.models import Member, Link, Group, Vote


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()
    filter_fields = ('id', 'first_name', 'last_name', 'username')

    @list_route(methods=['post'])
    def login(self, request):
        username = request.DATA.get('username', None)
        password = request.DATA.get('password', None)

        if username is not None and password is not None:
            member = authenticate(username=username, password=password)
            if member is not None:
                if member.is_active:
                    django_login(request, member)
                    token, created = Token.objects.get_or_create(user=member)
                    serializer = self.get_serializer(member)
                    return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['post'])
    def register(self, request):
        username = request.DATA.get('username', None)
        password = request.DATA.get('password', None)
        Member.objects.create_user(
            username=username,
            password=password
        )
        member = authenticate(username=username, password=password)
        django_login(request, member)
        serializer = self.get_serializer(member)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class LinkViewSet(viewsets.ModelViewSet):
    serializer_class = LinkSerializer
    queryset = Link.objects.all()
    # filter_fields = ('title')
    # starred = Link.objects.filter(star__isnull=False)
    # authentication_classes = (SessionAuthentication, BasicAuthentication)
    # permission_classes = (IsOwnerOrReadOnly,)

    def pre_save(self, obj):
        obj.posted_user = self.request.user

    @detail_route(methods=['post'])
    def upvote(self, request, pk):
        link = Link.objects.get(pk=pk)
        vote, created = Vote.objects.get_or_create(
                                   voter=request.user,
                                   link=link)
        vote.up_vote = True
        vote.save()
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['post'])
    def downvote(self, request, pk):
        link = Link.objects.get(pk=pk)
        vote, created = Vote.objects.get_or_create(
                           voter=request.user,
                           link=link)
        vote.up_vote = False
        vote.save()
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['post'])
    def favorite(self, request, pk):
        link = Link.objects.get(pk=pk)
        link.star = request.user
        link.save()
        return Response(status=status.HTTP_200_OK)
