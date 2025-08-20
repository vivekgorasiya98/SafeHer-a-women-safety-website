from rest_framework import serializers
from .models import User, VolunteerProfile

class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    name = serializers.CharField(max_length=100)
    role = serializers.ChoiceField(choices=['user', 'volunteer'])
    phone = serializers.CharField(max_length=20, required=False)
    
    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("User with this email already exists.")
        return value
    
    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            name=validated_data['name'],
            role=validated_data['role'],
            phone=validated_data.get('phone', ''),
            is_verified=validated_data['role'] == 'user'  # Auto-verify users
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create volunteer profile if role is volunteer
        if validated_data['role'] == 'volunteer':
            VolunteerProfile(user=str(user.id)).save()
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    name = serializers.CharField(max_length=100)
    role = serializers.CharField(read_only=True)
    phone = serializers.CharField(max_length=20, required=False)
    is_verified = serializers.BooleanField(read_only=True)
    emergency_contacts = serializers.ListField(
        child=serializers.CharField(max_length=200),
        required=False
    )
    share_location = serializers.BooleanField(required=False)
    anonymous_reporting = serializers.BooleanField(required=False)

class VolunteerProfileSerializer(serializers.Serializer):
    user = serializers.CharField(read_only=True)
    verification_status = serializers.CharField(read_only=True)
    skills = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False
    )
    availability = serializers.CharField(required=False)
    response_count = serializers.IntegerField(read_only=True)
    average_response_time = serializers.FloatField(read_only=True)
    rating = serializers.FloatField(read_only=True)
