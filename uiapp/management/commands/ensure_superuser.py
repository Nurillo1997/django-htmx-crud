import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Creates a superuser from DJANGO_SUPERUSER_* environment variables if one
    with that username doesn't already exist. Safe to run on every deploy
    (unlike `createsuperuser --noinput`, which errors out if the user
    already exists).
    """
    help = 'Creates a superuser from env vars if it does not already exist.'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            self.stdout.write(
                'DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD not set, skipping.'
            )
            return

        User = get_user_model()

        if User.objects.filter(username=username).exists():
            self.stdout.write(f'Superuser "{username}" already exists, skipping.')
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(f'Superuser "{username}" created.')