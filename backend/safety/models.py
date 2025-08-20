from mongoengine import Document, StringField, FloatField, DateTimeField, BooleanField, IntField, ListField
from datetime import datetime

class SOSAlert(Document):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('responded', 'Responded'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    user_id = StringField(required=True)
    user_name = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    address = StringField()
    status = StringField(choices=STATUS_CHOICES, default='active')
    priority = StringField(choices=PRIORITY_CHOICES, default='high')
    message = StringField()
    responders = ListField(StringField())  # List of volunteer user IDs
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    resolved_at = DateTimeField()
    
    meta = {
        'collection': 'sos_alerts',
        'indexes': ['user_id', 'status', 'created_at', 'priority']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'user_name': self.user_name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'address': self.address,
            'status': self.status,
            'priority': self.priority,
            'message': self.message,
            'responders': self.responders,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
        }

class IncidentReport(Document):
    TYPE_CHOICES = [
        ('harassment', 'Harassment'),
        ('suspicious_activity', 'Suspicious Activity'),
        ('unsafe_area', 'Unsafe Area'),
        ('poor_lighting', 'Poor Lighting'),
        ('other', 'Other'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    user_id = StringField()  # Optional for anonymous reports
    incident_type = StringField(choices=TYPE_CHOICES, required=True)
    severity = StringField(choices=SEVERITY_CHOICES, required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    address = StringField()
    description = StringField(required=True)
    incident_time = DateTimeField(required=True)
    is_anonymous = BooleanField(default=False)
    status = StringField(choices=[
        ('pending', 'Pending'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed')
    ], default='pending')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'incident_reports',
        'indexes': ['user_id', 'incident_type', 'severity', 'status', 'created_at']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': self.user_id if not self.is_anonymous else None,
            'incident_type': self.incident_type,
            'severity': self.severity,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'address': self.address,
            'description': self.description,
            'incident_time': self.incident_time.isoformat() if self.incident_time else None,
            'is_anonymous': self.is_anonymous,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class SafeZone(Document):
    name = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    radius = FloatField(default=500)  # meters
    zone_type = StringField(choices=[
        ('police_station', 'Police Station'),
        ('hospital', 'Hospital'),
        ('fire_station', 'Fire Station'),
        ('safe_house', 'Safe House'),
        ('public_place', 'Public Place'),
    ], required=True)
    description = StringField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'safe_zones',
        'indexes': ['zone_type', 'is_active']
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'radius': self.radius,
            'zone_type': self.zone_type,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class RiskZone(Document):
    name = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    radius = FloatField(default=200)  # meters
    risk_level = StringField(choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], required=True)
    description = StringField()
    incident_count = IntField(default=0)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'risk_zones',
        'indexes': ['risk_level', 'is_active', 'incident_count']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'radius': self.radius,
            'risk_level': self.risk_level,
            'description': self.description,
            'incident_count': self.incident_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
