from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('volunteer-profile/', views.volunteer_profile, name='volunteer_profile'),
    path('update-location/', views.update_location, name='update_location'),
]
