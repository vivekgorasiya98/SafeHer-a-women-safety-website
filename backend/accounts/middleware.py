from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.http import JsonResponse
import jwt
from django.conf import settings

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = self.get_token_from_request(request)
        
        if token:
            try:
                # Validate token
                UntypedToken(token)
                # Decode token to get user info
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                request.user = decoded_token
            except (InvalidToken, TokenError, jwt.ExpiredSignatureError):
                request.user = None
        else:
            request.user = None

        response = self.get_response(request)
        return response

    def get_token_from_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        return None
