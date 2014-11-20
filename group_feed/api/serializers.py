from rest_framework import serializers
from group_feed.models import Member, Group, Link, Comment, Tag, Vote


class MemberSerializer(serializers.ModelSerializer):
    starred_links = serializers.SerializerMethodField('get_starred')
    groups = serializers.SerializerMethodField('get_groups')
    posted_links = serializers.SerializerMethodField('get_posted_links')
    authored_comments = serializers.SerializerMethodField('get_authored_comments')
    voted_on = serializers.SerializerMethodField('get_votes')
    user_token = serializers.SerializerMethodField('get_user_token')
    profile_photo = serializers.SerializerMethodField('get_profile_photo')

    class Meta:
        model = Member
        fields = ('id', 'username', 'first_name', 'user_token', 'last_name', 'email', 'profile_photo', 'bio', 'date_joined', 'starred_links', 'groups', 'voted_on', 'posted_links', 'authored_comments')
        write_only_fields = ('password',)

    def get_starred(self, obj):
        return Link.objects.filter(star=obj)

    def get_groups(self, obj):
        return Group.objects.filter(member=obj)

    def get_posted_links(self, obj):
        return Link.objects.filter(posted_user=obj)

    def get_authored_comments(self, obj):
        return Comment.objects.filter(author=obj)

    def get_votes(self, obj):
        return Vote.objects.filter(voter=obj)

    def get_user_token(self, obj):
        return obj.auth_token

    def get_profile_photo(self, obj):
        return obj.profile_photo.url if obj.profile_photo else ""


class GroupSerializer(serializers.ModelSerializer):
    member_list = serializers.SerializerMethodField('get_user_list')
    links = serializers.SerializerMethodField('get_all_links')

    class Meta:
        model = Group
        fields = ('id', 'title', 'description', 'created_at', 'member_list', 'links')

    def get_user_list(self, obj):
        return obj.member.all()

    def get_all_links(self, obj):
        return Link.objects.filter(group=obj).values_list()


class ChildCommentSerializer(serializers.Serializer):

    def to_native(self, value):
        return self.parent.to_native(value)


class CommentSerializer(serializers.ModelSerializer):
    children = ChildCommentSerializer(many=True,)
    author = serializers.SerializerMethodField('get_author')

    class Meta:
        model = Comment
        fields = ('id', 'body', 'author', 'parent', 'children')

    def get_author(self, obj):
        return obj.author


class NewCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment


class LinkSerializer(serializers.ModelSerializer):
    submitter = serializers.SerializerMethodField('get_posted_user')
    group_name = serializers.SerializerMethodField('get_group_name')
    comments = serializers.SerializerMethodField('get_comments')
    tags = serializers.SerializerMethodField('get_tags')
    score = serializers.SerializerMethodField('get_link_score')
    # posted_user = MemberSerializer(read_only=True)

    class Meta:
        model = Link
        fields = ('id', 'title', 'url', 'description', 'created_at', 'score', 'star', 'group', 'group_name', 'submitter', 'tags', 'flag', 'comments')

    def get_comments(self, obj):
        all_comments = Comment.objects.filter(link=obj, parent__isnull=True)
        serializer = CommentSerializer(all_comments, many=True)
        return serializer.data

    def get_tags(self, obj):
        return Tag.objects.filter(link=obj)

    def get_group_name(self, obj):
        return Group.objects.get(link_group=obj)

    def get_posted_user(self, obj):
        return Member.objects.get(link_members=obj)

    def get_link_score(self, obj):
        down_votes = Vote.objects.filter(up_vote=False, link=obj).count()
        up_votes = Vote.objects.filter(up_vote=True, link=obj).count()
        total_score = up_votes - down_votes
        return total_score
