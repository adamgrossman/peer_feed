from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers
from group_feed.api.views import *
from merge import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register(r'members', MemberViewSet, base_name='members')
router.register(r'groups', GroupViewSet, base_name='groups')
router.register(r'links', LinkViewSet, base_name='links')

urlpatterns = patterns('',
    # url(r'^$', 'merge.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^feed/', 'group_feed.views.index', name="index"),
    url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
