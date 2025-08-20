from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import User, VolunteerProfile
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    VolunteerProfileSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['user_id'] = str(user.id)
        refresh['email'] = user.email
        refresh['role'] = user.role
        
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user.to_dict()
        }, status=status.HTTP_201_CREATED)

    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = User.objects(email=email, is_active=True).first()
        if user and user.check_password(password):
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            refresh['user_id'] = str(user.id)
            refresh['email'] = user.email
            refresh['role'] = user.role
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user.to_dict()
            }, status=status.HTTP_201_CREATED)

        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        user_id = request.user.id
        user = User.objects(id=user_id).first()
        
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            return Response(user.to_dict())
        
        elif request.method == 'PUT':
            serializer = UserProfileSerializer(data=request.data)
            if serializer.is_valid():
                # Update user fields
                for field, value in serializer.validated_data.items():
                    if hasattr(user, field):
                        setattr(user, field, value)
                user.save()
                
                return Response(user.to_dict())
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def volunteer_profile(request):
    try:
        user_id = request.user.id
        user = User.objects(id=user_id).first()
        
        if not user or user.role != 'volunteer':
            return Response({'error': 'Volunteer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        volunteer_profile = VolunteerProfile.objects(user=user_id).first()
        if not volunteer_profile:
            volunteer_profile = VolunteerProfile(user=user_id)
            volunteer_profile.save()
        
        if request.method == 'GET':
            serializer = VolunteerProfileSerializer(volunteer_profile)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = VolunteerProfileSerializer(data=request.data)
            if serializer.is_valid():
                for field, value in serializer.validated_data.items():
                    if hasattr(volunteer_profile, field):
                        setattr(volunteer_profile, field, value)
                volunteer_profile.save()
                
                return Response(VolunteerProfileSerializer(volunteer_profile).data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_location(request):
    try:
        user_id = request.user.id
        user = User.objects(id=user_id).first()
        
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if latitude is not None and longitude is not None:
            user.current_latitude = float(latitude)
            user.current_longitude = float(longitude)
            user.last_location_update = datetime.utcnow()
            user.save()
            
            return Response({'message': 'Location updated successfully'})
        
        return Response({'error': 'Latitude and longitude required'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
