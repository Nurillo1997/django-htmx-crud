#!/bin/sh
python manage.py migrate --noinput
exec gunicorn base.wsgi:application --bind 0.0.0.0:8000 --chdir /app