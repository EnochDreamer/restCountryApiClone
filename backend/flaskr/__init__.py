from flask import Flask, jsonify,request,abort
from flask_migrate import Migrate
from models import db_setup, Countries, Continents
from flask_cors import CORS
import os
from auth import AuthError, requires_auth
 
def create_app(test_config=None):
    app = Flask(__name__)

    db_setup(app,Migrate)
    ITEMS_PER_PAGE=2
    def paginate_items(request, items):
        page = request.args.get('page', 1, type=int)
        start = (page-1)*ITEMS_PER_PAGE
        end = start + ITEMS_PER_PAGE
        items_list = [item.format() for item in items]
        result = items_list[start:end]
        return result

    # enables CORS for any origin with the specified URI 
    CORS(app , resources={r"\*/api/\*":{"origins":"*"}})
    # Access control setups
    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization, true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,POST,OPTIONS"
        )
        return response
    def toLower(input):
        return input.lower()

    @app.route('/')
    @app.route('/success')
    @app.route('/countries/all')
    def get_countries():
        countries=Countries.query.all()
        return jsonify({
           "countries": paginate_items(request,countries),
           "total_countries":len(countries)
        })
    
    @app.route('/continents/<int:continent_id>')
    def get_countries_by_continent(continent_id):
        countries=Countries.query.filter_by(continent_id=continent_id).all()
        return jsonify({
           "countries": paginate_items(request,countries),
           "total_countries":len(countries)
        })

    @app.route('/continents', methods=['GET'])
    def get_continents():
        continents=Continents.query.all()
        return jsonify(
            [continent.format() for continent in continents]
        )
    @app.route('/continents/<int:continent_id>/<int:country_id>', methods=['GET'])
    def get_by_continent(continent_id,country_id=1):
        country=Countries.query.join(Continents).filter(Countries.id==country_id).filter(Continents.id==continent_id).one_or_none()
        if country is None:
            abort(404)
        
        return jsonify(
            country.format()
        )

    @app.route('/countries/name/<name>', methods=['GET'])
    def get_country_by_name(name):
        country=Countries.query.filter(Countries.common_name==toLower(name)).one_or_none()
        if country is None:
            abort(422)
        return jsonify({
            'success': True,
            'country':country,
            'country':country.format()
        }
            
        )
    @app.route('/countries/currency/<currency>', methods=['GET'])
    def get_country_by_currency(currency):
        country=Countries.query.filter(Countries.currency==toLower(currency)).one_or_none()
        if country is None:
            abort(422)
        return jsonify({
            'success': True,
            'country':country.format()
        }
            
        )
    @app.route('/countries', methods=['POST'])
    #@requires_auth("post:countries")
    def add_country():#paylad):
        body=request.get_json()
        if ('name' or 'currency' or 'population' or 'cca3' or 'official_language' or 'continent') not in body:
            abort(400)
        new_country=Countries(common_name=toLower(body['name']),currency=toLower(body['currency']),population=body['population'],cca3=toLower(body['cca3']), official_language=toLower(body['official_language']),continent_id=int(body['continent']))

        try:
            new_country.insert()
        except:
            abort(422)
            new_country.rollback()
        
        
        return jsonify({
            'success': True,
            'recently_added':new_country.format()
        }
            
        )
        


    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Bad request"
        }),400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
        }), 404

    @app.errorhandler(405)
    def wrong_method(error):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "method not allowed" 
        }), 405

    @app.errorhandler(422)
    def not_processable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "could not process recource"
        }), 422

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "internal server error"
        }), 500

    @app.errorhandler(401)
    def Unauthorized(error):
        return jsonify({
            "success": False,
            "error": 401,
            "message": "user not Authenticated"
        }), 401


    @app.errorhandler(403)
    def Forbidden(error):
        return jsonify({
            "success": False,
            "error": 403,
            "message": "resource forbidden"
        }), 403

    return app
