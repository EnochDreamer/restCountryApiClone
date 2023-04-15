from flask import Flask, jsonify,request,abort,redirect,url_for,g
from flask_migrate import Migrate
from models import db_setup, Countries, Continents,User,Anonymous
from flask_cors import CORS
import os
from auth import AuthError, requires_auth
from flask_login import LoginManager,login_user,current_user,login_required,logout_user
 
def create_app(test_config=None):
    app = Flask(__name__)
    
    db_setup(app,Migrate)

    ITEMS_PER_PAGE=5
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
            "Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT"
        )
        return response
    def toLower(input):
        return input.lower()
###########LOGIN LOGIC##########
    login_manager=LoginManager()
    login_manager.init_app(app)
    #login_manager.login_view='get_countries'
    login_manager.anonymous_user=Anonymous
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    @app.route('/login',methods=['POST'])
    def login():
        body=request.get_json()
        if not (body['email'] or body['password']):
            abort(400) 
        user=User.query.filter_by(email=body['email']).one_or_none()
        if user is None:
            abort(404)
        if not user.verify_password(body['password']):
            abort(401)
        login_user(user)
        return jsonify({
            'success':True,
            'status':200
        })

    @app.route('/sign-up',methods=['POST'])
    def sign_up():
        body=request.get_json()
        if not (body['email'] or body['password'] or body['username']):
            abort(400) 
        user_exists=User.query.filter_by(email=body['email']).first()
        if user_exists:
            abort(422)
        print(body)
        new_user=User(user_name=body['username'],email=body['email'])
        new_user.hash_password(body['password'])
        new_user.insert()
        return jsonify({
            'success':True,
            'status':200
        })

    @app.route('/log-out')
    @login_required
    def logout():
        logout_user()
        return jsonify({
            'success':True,
            'status':200
        })

################################
    
    # @app.route('/success')
    # @app.route('/countries/all')
    # def get_countries():
    #     countries=Countries.query.all()
    #     continents=Continents.query.all()
    #     return jsonify({
    #        "countries": paginate_items(request,countries),
    #        "total_countries":len(countries),
    #        "continents":[continent.format() for continent in continents],
    #        
    #     })

    @app.route('/')
    @app.route('/continents/<int:continent_id>')
    def get_countries_by_continent(continent_id=0):
        if continent_id==0:
            countries=Countries.query.all()
        else:
            countries=Countries.query.filter_by(continent_id=continent_id).all()
        continents=Continents.query.all()
        flash=request.args.get('flashMessage','')
        search_term= request.args.get('search_term','')
        if search_term:
            countries=Countries.query.filter(Countries.common_name.ilike(f'%{search_term}%')).all()
        print(search_term)
        return jsonify({
           "countries": paginate_items(request,countries),
           "total_countries":len(countries),
           "continents":[continent.format() for continent in continents],
           "user":current_user.format(),
           "search_term":search_term,
           "flash_message": f"matches found for '{search_term}':{len(countries)}" if (search_term) else flash 
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
        if body is None:
            abort(400)
        if not (body['name'] or body['currency'] or body['population'] or body['cca3'] or body['official_language'] or body['continent']):
            abort(400)
        
        new_country=Countries(common_name=toLower(body['name']),currency=toLower(body['currency']),population=body['population'],cca3=toLower(body['cca3']), official_language=toLower(body['official_language']),continent_id=int(body['continent']))

        try:
            new_country.insert()
        except Exception:
            abort(422)
            new_country.rollback()
        
        
        return jsonify({
            'success': True,
            'recently_added':new_country.format(),
            "flash_message": f"country ,{new_country.common_name} added successfuly"
        }
            
        )
    @app.route('/countries/<int:country_id>',methods=['DELETE'])
    @login_required
    def delete_country(country_id):
        country=Countries.query.filter_by(id=country_id).one_or_none()
        if country is None:
            abort(404)
        try:
            country.delete()
        except Exception:
            abort(422)
            country.rollback()

        return jsonify({
            'success': True,
            'deleted':country.id,
            "flash_message": f"country {country.common_name} deleted successfully"
        }
        )

    @app.route('/countries/<int:country_id>',methods=['PUT'])
    @login_required
    def edit_country(country_id):
        body=request.get_json()
        if body is None:
            abort(400)
        print(body)
        if not (body['common_name'] or body['currency'] or body['population'] or body['cca3'] or body['official_language'] or body['continent_id']):
            abort(400)
        country=Countries.query.filter_by(id=country_id).one_or_none()
        if country is None:
            abort(404)
        country.common_name=toLower(body['common_name'])
        country.population=toLower(body['population'])
        country.cca3=toLower(body['cca3'])
        country.currency=toLower(body['currency'])
        country.official_language=toLower(body['official_language'])
        country.continent_id=int(body['continent_id'])
        try:
            country.insert()
        except Exception:
            abort(422)
            country.rollback()

        return jsonify({
            'success': True,
            'edited':country.id,
            "flash_message": f"country {country.common_name} edited successfully"
        }
        )


   
    @app.route('/search',methods=['POST'])
    def search():
        search_term= request.form.get('search_term', '')
        results=Countries.query.filter(Countries.common_name.ilike(f'%{search_term}%')).all()
        return jsonify({
            'success':True,
            'search_term':search_term,
            'countries':paginate_items(request,results),
            'total_countries':len(results),
            'user':current_user.format()
        })


    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "flash_message": "Bad request"
        }),400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
        "success": False,
        "error": 404,
        "flash_message": "Resource not found"
        }), 404

    @app.errorhandler(405)
    def wrong_method(error):
        return jsonify({
            "success": False,
            "error": 405,
            "flash_message": "method not allowed" 
        }), 405

    @app.errorhandler(422)
    def not_processable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "flash_message": "could not process recource"
        }), 422

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "flash_message": "internal server error"
        }), 500

    @app.errorhandler(401)
    def Unauthorized(error):
        return jsonify({
            "success": False,
            "error": 401,
            "flash_message": "user not Authenticated"
        }), 401


    @app.errorhandler(403)
    def Forbidden(error):
        return jsonify({
            "success": False,
            "error": 403,
            "flash_message": "resource forbidden"
        }), 403

    return app
