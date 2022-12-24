import json
from flask import request, _request_ctx_stack, abort
from functools import wraps
from jose import jwt
from urllib.request import urlopen
import os


# my secrets , left here as this app isn't going to go to production
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN', 'enochdreamer.us.auth0.com')
ALGORITHMS = os.getenv('DB_USER', ['RS256'])
API_AUDIENCE = os.getenv('API_AUDIENCE', 'Rest')


# AuthError Exception
'''
AuthError Exception
A standardized way to communicate auth failure modes
'''


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


# Auth Header


# function to verify JWT


def get_token_auth_header():
    auth = request.headers['Authorization']
    if not auth:
        abort(401)

    # splits components on whitespace

    parts = auth.split(' ')

    # validates token to be a bearer token

    if parts[0].lower() != 'bearer':
        abort(401)

    # validates ten has two components

    if len(parts) != 2:
        abort(401)

    token = parts[1]
    return token




# checks for required permission


def check_permissions(permission, payload):
    if payload is None:
        abort(401)
    if "permissions" not in payload:
        abort(400)
    if permission not in payload["permissions"]:
        abort(403)
    return True


# verifies JWT Source signature


def verify_decode_jwt(token):
    jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
    jwks = json.loads(jsonurl.read())
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    if 'kid' not in unverified_header:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization malformed.'
        }, 401)

    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer='https://' + AUTH0_DOMAIN + '/'
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)

        except jwt.JWTClaimsError:
            raise AuthError({
                'code': 'invalid_claims',
                'description': 'Incorrect claims. Please, check the audience and issuer.'
            }, 401)
        except Exception:
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 400)
    raise AuthError({
        'code': 'invalid_header',
                'description': 'Unable to find the appropriate key.'
    }, 400)



# Authentication decorator function


def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                token = get_token_auth_header()
            except:
                abort(401)
            try:
                payload = verify_decode_jwt(token)
            except:
                abort(401)
            check_permissions(permission, payload)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator
