# Generated by Django 3.2.5 on 2021-07-22 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_comment_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]