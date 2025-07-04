"""
URL configuration for backendDjango project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'user/wordlist', UserWordListView, basename='user_wordlist')
router.register(r'user/graph', UserGraphViewSet, basename='user-graph')
from core.views import process_text
from core.views import generate_graph
from core.views import generate_text_from_wordsets

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/process-text/', process_text, name='process_text'),
    path('api/generate-text/', generate_text_from_wordsets, name='generate_text_from_wordsets'),
    path('api/generate-graph/', generate_graph, name='generate_graph'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/user/register/', UserCreate.as_view(), name='user_create'),
    path('accounts/', include('allauth.urls')),
    path('callback/', google_login_callback, name='callback'),
    path('api/auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/auth/user/<int:item_id>/', UserDetailView.as_view(), name='user_detail_patch'),
    path('api/google/validate_token/', validate_google_token, name='validate_token'),
    path('api/users/', UserListView.as_view(), name='user_list'),
    path('api/user-exists/', CheckUserExistsView.as_view(), name='user-exists'),
    path('auth/api/login/google/', GoogleLoginApi.as_view(), name='google_login' ),

    path('api/', include(router.urls)),
]
