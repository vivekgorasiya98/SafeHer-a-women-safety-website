from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy', 'message': 'Backend is running'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/accounts/', include('accounts.urls')),
    path('api/safety/', include('safety.urls')),
    path('api/community/', include('community.urls')),
]
