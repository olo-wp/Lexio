import json
from urllib.parse import urlencode

from allauth.socialaccount.models import SocialAccount, SocialToken
from django.conf import settings
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserWordList, UserGraph
from .serializers import UserSerializer, UserWordListSerializer, UserGraphSerializer, AuthSerializer
from .services import get_user_data

from .graphGeneration.functionCalling.getResponse import get_response
from .graphGeneration.functionCalling.functions import *
from .graphGeneration.functionCalling.systemPrompts import *


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

    def patch(self, request, item_id):
        try:
            user = User.objects.get(pk=item_id)
        except(User.DoesNotExist):
            return Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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



class UserGraphViewSet(viewsets.ModelViewSet):
    serializer_class = UserGraphSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserGraph.objects.filter(user=self.request.user)

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



# EXAMPLE VIEW
@csrf_exempt  # This allows POST requests from your frontend (remove in production with proper CSRF handling)
def process_text(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            text = data.get('text', '')

            # Perform your calculations here
            # Example: count words and characters
            word_count = len(text.split())
            char_count = len(text)

            # Prepare response data
            response_data = {
                'original_text': text,
                'word_count': word_count,
                'char_count': char_count,
                # Add any other calculated fields here
            }

            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)



@csrf_exempt
def generate_graph(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            text = data.get('text', '')

            # Perform your calculations here

            response = get_response(text=text, system_prompt=GRAPH_GENERATION_SYSTEM_PROMPT, function=GRAPH_GENERATION_FUNCTION)

            print(response)

            # !!!!1 HANDLE DIFFERENT RESPONSES< IF WE PUT NONSENSE IN WE GET DIFFERENT RESPONSE
            arguments_dict = json.loads(response.output[0].arguments)

            print(arguments_dict)


            return JsonResponse(arguments_dict)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


@csrf_exempt
def generate_text_from_wordsets(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body

            data = json.loads(request.body)

            language = data.get('language', 'german')
            level = data.get('level', 'any')
            words = data.get('words', [])

            # Perform your calculations here
            text = f"Generate a short and simple text in {language}, appropriate for level {level}, using the following words: {', '.join(words)}."


            response = get_response(text=text, system_prompt=TEXT_GENERATION_SYSTEM_PROMPT,
                                    function=TEXT_GENERATION_FUNCTION)

            arguments_dict = json.loads(response.output[0].arguments)

            print(arguments_dict.get('generated_text'))
            #generated_text = arguments_dict.get('generated_text')

            return JsonResponse(arguments_dict)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

