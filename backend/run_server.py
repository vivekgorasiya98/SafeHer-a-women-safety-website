#!/usr/bin/env python
"""
Development server runner for SafeGuard backend
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safeguard.settings')
    
    # Setup Django
    django.setup()
    
    # Create sample data
    from accounts.models import User, VolunteerProfile
    from safety.models import SafeZone, RiskZone
    from community.models import CommunityPost, Announcement
    
    print("Setting up sample data...")
    
    # Create admin user
    admin_user = User.objects(email='admin@safeguard.com').first()
    if not admin_user:
        admin_user = User(
            email='admin@safeguard.com',
            name='Admin User',
            role='admin',
            is_verified=True
        )
        admin_user.set_password('admin123')
        admin_user.save()
        print("Created admin user: admin@safeguard.com / admin123")
    
    # Create volunteer user
    volunteer_user = User.objects(email='volunteer@safeguard.com').first()
    if not volunteer_user:
        volunteer_user = User(
            email='volunteer@safeguard.com',
            name='Jane Volunteer',
            role='volunteer',
            is_verified=True
        )
        volunteer_user.set_password('volunteer123')
        volunteer_user.save()
        
        # Create volunteer profile
        VolunteerProfile(
            user=str(volunteer_user.id),
            verification_status='approved'
        ).save()
        print("Created volunteer user: volunteer@safeguard.com / volunteer123")
    
    # Create regular user
    regular_user = User.objects(email='user@safeguard.com').first()
    if not regular_user:
        regular_user = User(
            email='user@safeguard.com',
            name='Sarah User',
            role='user',
            is_verified=True
        )
        regular_user.set_password('user123')
        regular_user.save()
        print("Created regular user: user@safeguard.com / user123")
    
    # Create safe zones
    if SafeZone.objects().count() == 0:
        safe_zones = [
            SafeZone(name='Central Police Station', latitude=40.7831, longitude=-73.9712, zone_type='police_station'),
            SafeZone(name='City Hospital', latitude=40.7549, longitude=-73.984, zone_type='hospital'),
            SafeZone(name='Fire Station 1', latitude=40.7614, longitude=-73.9776, zone_type='fire_station'),
        ]
        for zone in safe_zones:
            zone.save()
        print("Created sample safe zones")
    
    # Create risk zones
    if RiskZone.objects().count() == 0:
        risk_zones = [
            RiskZone(name='High Crime Area', latitude=40.7505, longitude=-73.9934, risk_level='high'),
            RiskZone(name='Poorly Lit Street', latitude=40.7282, longitude=-73.9942, risk_level='medium'),
        ]
        for zone in risk_zones:
            zone.save()
        print("Created sample risk zones")
    
    print("Sample data setup complete!")
    print("\nStarting Django development server...")
    
    # Start the development server
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])
