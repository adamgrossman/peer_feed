# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('group_feed', '0002_auto_20141113_1816'),
    ]

    operations = [
        migrations.AlterField(
            model_name='link',
            name='star',
            field=models.ForeignKey(related_name='link_star', blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
    ]
