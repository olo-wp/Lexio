from django.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import ValidationError
from urllib.parse import urlencode
from rest_framework_simplejwt.tokens import RefreshToken
from typing import Dict, Any
import requests
from django.contrib.auth import get_user_model

User = get_user_model()

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
LOGIN_URL = f'{settings.BASE_APP_URL}/internal/login'


def google_get_access_token(code: str, redirect_uri: str) -> str:
    data = {
        'code': code,
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        print("ERROR: ", response.text)
        raise ValidationError('Could not obtain access token from google: ')

    access_token = response.json()['access_token']
    return access_token


def google_get_user_info(access_token: str) -> Dict[str, Any]:
    response = requests.get(GOOGLE_USER_INFO_URL, params={'access_token': access_token})

    if not response.ok:
        raise ValidationError('Could not obtain user info from google')

    return response.json()


def get_user_data(validated_data):
    domain = settings.BASE_API_URL
    redirect_uri = f'{domain}/auth/api/login/google/'

    code = validated_data.get('code')
    error = validated_data.get('error')

    if error or not code:
        params = urlencode({'error': error})
        return redirect(f'{LOGIN_URL}?{params}')

    access_token = google_get_access_token(code, redirect_uri)
    user_data = google_get_user_info(access_token)

    try:
        user = User.objects.get(
            email=user_data['email'],
            first_name=user_data.get('given_name'),
            last_name=user_data.get('family_name')
        )
    except User.DoesNotExist:
        user = User.objects.create(
            username=user_data['email'],
            email=user_data['email'],
            first_name=user_data.get('given_name'),
            last_name=user_data.get('family_name')
        )

    refresh_token = RefreshToken.for_user(user)
    access_token = refresh_token.access_token

    profile_data = {
        'email': user_data['email'],
        'first_name': user_data['given_name'],
        'last_name': user_data['family_name'],
        'access_token': str(access_token),
        'refresh_token': str(refresh_token),
    }

    return profile_data
