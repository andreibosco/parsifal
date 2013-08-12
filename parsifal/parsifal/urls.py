# coding: utf-8

from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'core.views.home'),
    (r'^signin/$', 'core.views.signin'),
    (r'^signout/$', 'core.views.signout'),
    (r'^users/new/$', 'users.views.new'),
    (r'^users/profile/$', 'users.views.edit'),
    (r'^reviews/new/$', 'reviews.views.new'),
    (r'^reviews/add_author/$', 'reviews.views.add_author_to_review'),
    (r'^reviews/remove_author/$', 'reviews.views.remove_author_from_review'),
    (r'^(?P<username>[\w-]+)/(?P<review_name>[\w-]+)/$', 'reviews.views.review'),
    (r'^(?P<username>[\w-]+)/$', 'reviews.views.reviews'),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
