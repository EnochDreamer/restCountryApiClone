from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import UserMixin,LoginManager,AnonymousUserMixin
from uuid import uuid4


db=SQLAlchemy()

database_path='postgresql://postgres:Enochgenius7@localhost:5432/assignment'

def db_setup(app,Migrate,database_path=database_path,db=db):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key='seceret key you fear'
    db.app = app
    db.init_app(app)
    migrate=Migrate(app,db)
    return db


class Anonymous(AnonymousUserMixin):
    def __init__(self):
        self.user_name='welcome buddy!'

    def format(self):
        return ({
                'id':0,
                'user_name':self.user_name,
                'email':'',
                'is_authenticated':False
            })

class User(db.Model,UserMixin):
    __tablename__='my_user'
    id=db.Column(db.Integer,primary_key=True,nullable=False)
    user_name=db.Column(db.String(),nullable=False,unique=True)
    email=db.Column(db.String(),nullable=False,unique=True)
    password_hash=db.Column(db.String(),nullable=False)
    def hash_password(self,password):
        self.password_hash=generate_password_hash(password, method='sha256')
    def verify_password(self,password):
        return check_password_hash(self.password_hash,password)

    def format(self):
        return ({
            'id':self.id,
            'user_name':self.user_name,
            'email':self.email,
            'is_authenticated':True
        })


    def insert(self):
        db.session.add(self)
        db.session.commit()

class Continents(db.Model):
    id=db.Column(db.Integer,primary_key=True,nullable=False)
    name=db.Column(db.String(),nullable=False)
    countries=db.relationship('Countries' , backref=db.backref('continent' , lazy='joined' ),passive_deletes=True)

    def format(self):
        return ({
            'id':self.id,
            'name':self.name
        })

class Countries(db.Model):
    id=db.Column(db.Integer ,primary_key=True,nullable=False)
    common_name=db.Column(db.String() ,nullable=False)
    population=db.Column(db.String ,nullable=False)
    currency=db.Column(db.String() ,nullable=False) 
    cca3=db.Column(db.String() ,nullable=False) 
    official_language=db.Column(db.String() ,nullable=False)
    continent_id=db.Column(db.Integer, db.ForeignKey('continents.id' , ondelete='CASCADE'), nullable=False)


    def format(self):
        return ({
            'id':self.id,
            'common_name':self.common_name,
            'population':self.population,
            'currency':self.currency,
            'cca3':self.cca3,
            'official_language':self.official_language,
            'continent_id':self.continent_id,
            'continent_name':self.continent.name

        })

    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def insert(self):
        db.session.add(self)
        db.session.commit()
        
    def close(self):
        db.session.close()
    
    def rollback(self):
        db.session.rollback()