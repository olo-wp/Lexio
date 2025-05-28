#!/bin/sh

echo "running makemigrations"
python manage.py makemigrations

echo "running migrate"
python manage.py migrate

echo "running server"
python manage.py runserver 0.0.0.0:8080