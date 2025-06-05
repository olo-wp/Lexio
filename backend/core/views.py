from django.conf import settings
from urllib.parse import urlencode
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from rest_framework import generics, status, viewsets, permissions
from .serializers import UserSerializer, UserWordListSerializer, AuthSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialAccount, SocialToken
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserWordList
from .services import get_user_data
from django.http import HttpResponse

import json

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserWordListView(viewsets.ModelViewSet):
    serializer_class = UserWordListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserWordList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("social account for user: ", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("no social account for user", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')

    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print("Google token found ", token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print("no Google token found for user", user)
        return redirect('http://localhost:5173/login/callback/?error=NoGoogleToken')


@csrf_exempt
def validate_google_token(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            google_access_token = data.get('google_access_token')
            print(google_access_token)
            if not google_access_token:
                return JsonResponse({'error': 'No Google token'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'invalid json'}, status=400)
    return JsonResponse({'detail': 'method not allowed'}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
class CheckUserExistsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.query_params.get('login')

        if not username:
            return Response({'error': 'Missing login parameter'}, status=status.HTTP_400_BAD_REQUEST)

        exists = User.objects.filter(username=username).exists()
        return Response({'exists': exists})


class GoogleLoginApi(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        auth_serializer = AuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)

        validated_data = auth_serializer.validated_data
        user_data = get_user_data(validated_data)

        frontend_url = f"{settings.BASE_APP_URL}/auth/callback"
        query_params = urlencode(user_data)
        redirect_url = f"{frontend_url}?{query_params}"
        return redirect(redirect_url)


class LogoutApi(APIView):
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponse('200')
