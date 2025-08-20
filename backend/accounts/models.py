from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField, ListField, FloatField,IntField
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime

class User(Document):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('volunteer', 'Volunteer'),
        ('admin', 'Admin'),
    ]
    
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, max_length=128)
    name = StringField(required=True, max_length=100)
    role = StringField(choices=ROLE_CHOICES, default='user')
    phone = StringField(max_length=20)
    is_verified = BooleanField(default=False)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Location fields
    current_latitude = FloatField()
    current_longitude = FloatField()
    last_location_update = DateTimeField()
    
    # Emergency contacts
    emergency_contacts = ListField(StringField(max_length=200))
    
    # Profile settings
    share_location = BooleanField(default=True)
    anonymous_reporting = BooleanField(default=False)
    
    meta = {
        'collection': 'users',
        'indexes': ['email', 'role', 'is_active']
    }
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'phone': self.phone,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'emergency_contacts': self.emergency_contacts,
            'share_location': self.share_location,
            'anonymous_reporting': self.anonymous_reporting,
        }

    @property
    def is_authenticated(self):
        return True
    
class VolunteerProfile(Document):
    user = StringField(required=True)  # User ID reference
    verification_status = StringField(choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    verification_documents = ListField(StringField())
    skills = ListField(StringField())
    availability = StringField()
    response_count = IntField(default=0)
    average_response_time = FloatField(default=0.0)
    rating = FloatField(default=0.0)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'volunteer_profiles',
        'indexes': ['user', 'verification_status']
    }
    @property
    def is_authenticated(self):
        return True
